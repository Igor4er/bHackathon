import httpx
from fastapi import HTTPException
from http import HTTPStatus
from settings import SETTINGS
from dto.auth import GitHubUser


GH_EXCHANGE_URL = "https://github.com/login/oauth/access_token"
GH_USER_EMAILS_URL = "https://api.github.com/user/emails"
GH_USER_PROFILE_URL = "https://api.github.com/user"


async def exchange_code_for_token(code: str) -> str:
    exchange_params = {
        "client_id": SETTINGS.gh_client_id,
        "client_secret": SETTINGS.gh_client_secret.get_secret_value(),
        "code": code,
    }

    headers = {"Accept": "application/json"}

    async with httpx.AsyncClient() as client:
        response = await client.post(
            GH_EXCHANGE_URL, data=exchange_params, headers=headers
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


async def get_user_email(access_token: str) -> str:
    headers = {"Authorization": f"Bearer {access_token}", "Accept": "application/json"}

    async with httpx.AsyncClient() as client:
        response = await client.get(GH_USER_EMAILS_URL, headers=headers)

        if response.status_code != 200:
            raise HTTPException(
                status_code=HTTPStatus.BAD_REQUEST, detail="Failed to fetch user email"
            )

        emails_data = response.json()

        # GitHub returns list of email objects, we want primary and verified email
        primary_email = next(
            (
                email["email"]
                for email in emails_data
                if email["primary"] and email["verified"]
            ),
            None,
        )

        if not primary_email:
            raise HTTPException(
                status_code=HTTPStatus.BAD_REQUEST,
                detail="No primary verified email found",
            )

        return primary_email


async def get_user_profile(access_token: str) -> GitHubUser:
    headers = {"Authorization": f"Bearer {access_token}", "Accept": "application/json"}

    async with httpx.AsyncClient() as client:
        response = await client.get(GH_USER_PROFILE_URL, headers=headers)

        if response.status_code != 200:
            raise HTTPException(
                status_code=HTTPStatus.BAD_REQUEST,
                detail="Failed to fetch user profile",
            )

        profile = response.json()
        return GitHubUser.model_validate(profile)
