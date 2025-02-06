from typing import Annotated
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from services.jwt import verify_token
from http import HTTPStatus
from dto.user import User, Newcomer


oauth2_scheme = HTTPBearer()

async def get_user(token: Annotated[HTTPAuthorizationCredentials, Depends(oauth2_scheme)]) -> User:
    payload = verify_token(token.credentials)
    if payload is None:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="Could not validate credentials"
        )
    return User.model_validate(payload)


async def get_newcomer(token: Annotated[HTTPAuthorizationCredentials, Depends(oauth2_scheme)]) -> Newcomer:
    payload = verify_token(token.credentials, register=True)
    if payload is None:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="Could not validate credentials"
        )
    return Newcomer.model_validate(payload)
