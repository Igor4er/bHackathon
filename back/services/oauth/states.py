from db.redis import redis_client
import secrets


async def store_oauth_state() -> str:
    """
    Generate and store a new OAuth state token in Redis.
    """
    state = secrets.token_urlsafe(16)
    await redis_client.setex(
        f"oauth2:valid_states:{state}", 10 * 60, "1"  # value in seconds
    )
    return state


async def verify_oauth_state(state: str) -> bool:
    """
    Verify if the OAuth state token exists and is valid.
    Also removes the state token after verification (one-time use).
    """
    key = f"oauth2:valid_states:{state}"

    async with redis_client.pipeline() as pipe:
        try:
            await pipe.watch(key)

            # Check if exists
            exists = await redis_client.exists(key)
            if not exists:
                return False

            # Delete the key and execute
            pipe.multi()
            await pipe.delete(key)
            await pipe.execute()
            return True

        except Exception:
            return False
        finally:
            await pipe.unwatch()
