from typing import Annotated
from fastapi import APIRouter, Request, HTTPException
from fastapi.params import Depends
from dto.user import User, CreateProfileRequest
from db.models import User as DBUser
from settings import SETTINGS
from services.oauth.states import store_oauth_state, verify_oauth_state
from services.oauth.github import exchange_code_for_token, get_user_email, get_user_profile
from services.jwt import create_access_token
from urllib.parse import urlencode
from http import HTTPStatus
from services.auth import get_user, get_db_user
from db.models import User as UserModel
from peewee import DoesNotExist


router = APIRouter(prefix="/auth", tags=["Account system"])

GH_AUTHORIZE_URL = "https://github.com/login/oauth/authorize"


async def authenticate_user_by_email(email: str, name: str, avatar_url: str | None = None):
    """
    Authenticate user by email and return appropriate token response.
    If user doesn't exist, create new user with provided name.
    """
    new_user = False
    try:
        user = UserModel.get(UserModel.email == email)
    except DoesNotExist:
        new_user = True
        user = UserModel.create(
            email=email,
            name=name,
            avatar_url=avatar_url
        )

    data = {"sub": email, "name": user.name}
    token = create_access_token(data)
    return {
        "new_user": new_user,
        "access_token": token,
        "token_type": "bearer"
    }


@router.get("/gh/link")
async def github_oauth_link(request: Request):
    state = await store_oauth_state()
    params = {
        "client_id": SETTINGS.gh_client_id,
        "scope": "user:email",
        "state": state
    }
    full_url = f"{GH_AUTHORIZE_URL}?{urlencode(params)}"
    return {"url": full_url}


@router.get("/gh/token")
async def handle_successful_github_oauth(code: str, state: str):
    # Verify the state parameter
    state_valid = await verify_oauth_state(state)
    if not state_valid:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="Invalid state parameter"
        )

    access_token = await exchange_code_for_token(code)
    user_email = await get_user_email(access_token)
    user_profile = await get_user_profile(access_token)

    return await authenticate_user_by_email(user_email, user_profile.login, user_profile.avatar_url)


@router.post("/profile", status_code=500)
async def create_profile(
    profile: CreateProfileRequest,
    user: Annotated[User, Depends(get_user)]
):
    return user


@router.get("/me")
async def get_myself(user: Annotated[DBUser, Depends(get_db_user)]) -> dict:
    print(dir(user))
    return {
        "name": user.name,
        "email": user.email,
        "avatar_url": user.avatar_url
    }
