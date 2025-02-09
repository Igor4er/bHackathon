from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import SecretStr


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DEBUG: bool = False

    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_password: SecretStr | None = None
    redis_username: str | None = None
    redis_ssl: bool = False

    jwt_secret_key: SecretStr

    gh_client_id: str
    gh_client_secret: SecretStr

    google_client_id: str
    google_client_secret: SecretStr

    resend_api_key: SecretStr
    email_sender: str

    frontend_url: str

    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: SecretStr
    AWS_REGION: str
    S3_BUCKET_NAME: str


SETTINGS = Settings()  # type: ignore
