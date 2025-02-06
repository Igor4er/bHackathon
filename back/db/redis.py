from redis.asyncio import Redis
from settings import SETTINGS

redis_client = Redis(
    host=SETTINGS.redis_host,
    port=SETTINGS.redis_port,
    username=SETTINGS.redis_username,
    password=SETTINGS.redis_password.get_secret_value() if SETTINGS.redis_password else None,
    ssl=SETTINGS.redis_ssl
)
