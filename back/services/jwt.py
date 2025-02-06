from datetime import datetime, timedelta
from jose import jwt
from settings import SETTINGS

ISSUER = "bH"


def create_access_token(data: dict, expires_delta: timedelta = timedelta(days=7)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire, "iss": ISSUER})
    encoded_jwt = jwt.encode(
        to_encode,
        SETTINGS.jwt_secret_key.get_secret_value(),
        algorithm="HS256"
    )
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SETTINGS.jwt_secret_key.get_secret_value(),
            algorithms=["HS256"],
            issuer=ISSUER
        )
        return payload
    except:
        return None
