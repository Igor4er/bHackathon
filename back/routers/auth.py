from typing import Annotated
from fastapi import APIRouter, Request, HTTPException, Depends
from dto.user import (
    UserProfileResponse,
    UpdateProfileRequest
)
from dto.auth import (
    OAuthLinkResponse,
    TokenResponse,
    EmailSendResponse
)
from db.models import User as DBUser
from settings import SETTINGS
from services.oauth.states import store_oauth_state, verify_oauth_state
from services.oauth.github import (
    exchange_code_for_token,
    get_user_email,
    get_user_profile,
)
from services.jwt import create_access_token, verify_email_code
from urllib.parse import urlencode
from http import HTTPStatus
from services.auth import get_db_user
from db.models import User as UserModel
from peewee import DoesNotExist
from services.email.messages import send_confirmation_email
from services.email.rate_limit import check_email_rate_limit


router = APIRouter(prefix="/auth", tags=["Account system"])

GH_AUTHORIZE_URL = "https://github.com/login/oauth/authorize"


async def authenticate_user_by_email(
    email: str, name: str, avatar_url: str | None = None
) -> TokenResponse:
    """
    Authenticate user by email and return appropriate token response.
    If user doesn't exist, create new user with provided name.
    """
    new_user = False
    try:
        user = UserModel.get(UserModel.email == email)
    except DoesNotExist:
        new_user = True
        user = UserModel.create(email=email, name=name, avatar_url=avatar_url)

    data = {"sub": email, "name": user.name}
    token = create_access_token(data)
    return TokenResponse(new_user=new_user, access_token=token, token_type="bearer")


async def verify_state(state: str):
    state_valid = await verify_oauth_state(state)
    if not state_valid:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="Invalid state parameter"
        )
    return state


@router.get("/gh/link", response_model=OAuthLinkResponse)
async def github_oauth_link(request: Request) -> OAuthLinkResponse:
    state = await store_oauth_state(prefix="github")
    params = {"client_id": SETTINGS.gh_client_id, "scope": "user:email", "state": state}
    full_url = f"{GH_AUTHORIZE_URL}?{urlencode(params)}"
    return OAuthLinkResponse(url=full_url)


@router.get("/gh/token", response_model=TokenResponse)
async def handle_successful_github_oauth(code: str, state: Annotated[str, (verify_state)]) -> TokenResponse:
    access_token = await exchange_code_for_token(code)
    user_email = await get_user_email(access_token)
    user_profile = await get_user_profile(access_token)

    return await authenticate_user_by_email(
        user_email, user_profile.login, user_profile.avatar_url
    )


@router.patch("/profile", response_model=UserProfileResponse)
async def update_profile(
    profile: UpdateProfileRequest,
    user: Annotated[DBUser, Depends(get_db_user)]
) -> UserProfileResponse:
    try:
        update_data = {
            key: value for key, value in profile.dict().items()
            if value is not None
        }

        if not update_data:
            raise HTTPException(
                status_code=400,
                detail="No valid fields to update"
            )

        query = DBUser.update(**update_data).where(DBUser.email == user.email)
        query.execute()

        user = user.get()

        return UserProfileResponse(
            name=str(user.name),
            email=str(user.email),
            avatar_url=str(user.avatar_url) if user.avatar_url is not None else None
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update profile: {str(e)}"
        )


@router.get("/me", response_model=UserProfileResponse)
async def get_myself(
    user: Annotated[DBUser, Depends(get_db_user)],
) -> UserProfileResponse:
    print(dir(user))
    return UserProfileResponse(
        name=str(user.name),
        email=str(user.email),
        avatar_url=str(user.avatar_url) if user.avatar_url is not None else None,
    )


@router.post(
    "/em/send",
    response_model=EmailSendResponse,
    responses={
        HTTPStatus.TOO_MANY_REQUESTS: {
            "description": "Rate limit exceeded"
        }
    })
async def send_email(
    email: str
) -> EmailSendResponse:
    await check_email_rate_limit(email)  # raises HTTPException if sending limited

    state = await store_oauth_state(prefix="email")
    try:
        await send_confirmation_email(state, email)
        return EmailSendResponse(
            status="success",
            message=f"Email will be sent to: {email}",
            from_email=SETTINGS.email_sender
        )
    except Exception as e:
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail=f"Failed to process email request: {str(e)}"
        )


@router.get("/em/token", response_model=TokenResponse)
async def handle_successful_email_token(code: str, state: Annotated[str, (verify_state)]) -> TokenResponse:
    user_email = verify_email_code(code)
    if user_email is None:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="Invalid code"
        )
    user_name = user_email.split("@")[0]

    return await authenticate_user_by_email(
        user_email, user_name, avatar_url=None
    )
