from datetime import datetime, timedelta
from jose import jwt
from settings import SETTINGS

ISSUER = "bH"
ISSUER_AUTH = "bH-authcode"


def create_access_token(data: dict, expires_delta: timedelta = timedelta(days=7)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    to_encode.update({"iss": ISSUER})
    encoded_jwt = jwt.encode(
        to_encode, SETTINGS.jwt_secret_key.get_secret_value(), algorithm="HS256"
    )
    return encoded_jwt


def verify_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SETTINGS.jwt_secret_key.get_secret_value(),
            algorithms=["HS256"],
            issuer=ISSUER,
        )
        return payload
    except:
        return None


def create_email_code(email: str):
    to_encode = {"email": email}
    expire = datetime.utcnow() + timedelta(minutes=10)
    to_encode.update({"exp": expire})  # type: ignore
    to_encode.update({"iss": ISSUER_AUTH})
    encoded_jwt = jwt.encode(
        to_encode, SETTINGS.jwt_secret_key.get_secret_value(), algorithm="HS256"
    )
    return encoded_jwt


def verify_email_code(token: str) -> str | None:
    try:
        payload = jwt.decode(
            token,
            SETTINGS.jwt_secret_key.get_secret_value(),
            algorithms=["HS256"],
            issuer=ISSUER_AUTH,
        )
        return payload.get("email")
    except:
        return None
