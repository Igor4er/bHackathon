from typing import Annotated
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from services.jwt import verify_token
from http import HTTPStatus
from dto.user import User
from db.models import User as DBUser
from peewee import DoesNotExist


oauth2_scheme = HTTPBearer()


async def get_user(
    token: Annotated[HTTPAuthorizationCredentials, Depends(oauth2_scheme)],
) -> User:
    payload = verify_token(token.credentials)
    if payload is None:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED, detail="Could not validate credentials"
        )
    return User.model_validate(payload)


async def get_db_user(user: User = Depends(get_user)) -> DBUser:
    try:
        db_user = DBUser.get(DBUser.email == user.email)
        if not db_user.is_active:
            raise HTTPException(
                status_code=HTTPStatus.FORBIDDEN, detail="User account is inactive"
            )
        return db_user
    except DoesNotExist:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="User not found")
