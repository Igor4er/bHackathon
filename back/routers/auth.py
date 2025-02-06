from typing import Annotated
from fastapi import APIRouter, Request, HTTPException
from fastapi.params import Depends
from dto.user import User, Newcomer, CreateProfileRequest
from settings import SETTINGS
from services.oauth.states import store_oauth_state, verify_oauth_state
from services.oauth.github import exchange_code_for_token, get_user_email
from services.jwt import create_access_token
from urllib.parse import urlencode
from http import HTTPStatus
from services.auth import get_user, get_newcomer
from db.models import User as UserModel
from peewee import DoesNotExist


router = APIRouter(prefix="/auth")

GH_AUTHORIZE_URL = "https://github.com/login/oauth/authorize"


def authenticate_user_by_email(email: str):
    """
    Authenticate user by email and return appropriate token response
    """
    try:
        user = UserModel.get(UserModel.email == email)
        data = {"sub": email, "name": user.name}
        token = create_access_token(data)
        return {
            "new_user": False,
            "access_token": token,
            "token_type": "bearer"
        }
    except DoesNotExist:
        token = create_access_token({"sub": email}, register=True)
        return {
            "new_user": True,
            "registration_token": token,
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

    return authenticate_user_by_email(user_email)


@router.post("/profile")
async def create_profile(
    profile: CreateProfileRequest,
    newcomer: Annotated[Newcomer, Depends(get_newcomer)]
):
    user = UserModel.create(
        email=newcomer.email,
        name=profile.name,
        avatar_url=profile.avatar_url
    )

    token_data = {
        "sub": user.email,
        "name": user.name
    }
    token = create_access_token(token_data)

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.get("/me")
async def get_myself(user: Annotated[User, Depends(get_user)]):
    return user
