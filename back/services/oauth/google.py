import httpx
from fastapi import Request, HTTPException
from http import HTTPStatus
from settings import SETTINGS
from dto.auth import GoogleUser

GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"


async def exchange_code_for_token(code: str) -> str:
    token_data = {
        "client_id": SETTINGS.google_client_id,
        "client_secret": SETTINGS.google_client_secret.get_secret_value(),
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": f"{SETTINGS.frontend_url}/login"
    }

    headers = {"Accept": "application/json"}

    async with httpx.AsyncClient() as client:
        response = await client.post(
            GOOGLE_TOKEN_URL, data=token_data, headers=headers
        )
        if response.status_code != 200:
            raise HTTPException(
                status_code=HTTPStatus.BAD_REQUEST,
                detail="Failed to exchange code for access token",
            )

        token_data = response.json()

        if "error" in token_data:
            raise HTTPException(
                status_code=HTTPStatus.BAD_REQUEST,
                detail=token_data.get("error_description", "Failed to exchange code"),
            )

        return token_data.get("access_token")


async def get_user_profile(access_token: str) -> GoogleUser:
    headers = {"Authorization": f"Bearer {access_token}", "Accept": "application/json"}

    async with httpx.AsyncClient() as client:
        response = await client.get(GOOGLE_USERINFO_URL, headers=headers)

        if response.status_code != 200:
            raise HTTPException(
                status_code=HTTPStatus.BAD_REQUEST,
                detail="Failed to fetch user profile",
            )

        profile = response.json()
        return GoogleUser.model_validate(profile)
