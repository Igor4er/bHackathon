from typing import Annotated
from fastapi import APIRouter, Request, HTTPException
from fastapi.params import Depends
from dto.user import User
from settings import SETTINGS
from services.oauth.states import store_oauth_state, verify_oauth_state
from services.oauth.github import exchange_code_for_token, get_user_email
from services.jwt import create_access_token
from urllib.parse import urlencode
from http import HTTPStatus
from services.auth import get_user


router = APIRouter(prefix="/auth")

GH_AUTHORIZE_URL = "https://github.com/login/oauth/authorize"


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

    token = create_access_token({"sub": user_email})

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.get("/me")
async def get_myself(user: Annotated[User, Depends(get_user)]):
    return user
