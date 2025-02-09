from db.redis import redis_client
from fastapi import HTTPException
from http import HTTPStatus

EMAIL_COOLDOWN = 2 * 60
EMAIL_BLOCK_TIME = 30 * 60  # value in seconds
MAX_EMAILS = 10

async def check_email_rate_limit(email: str) -> None:
    """
    Check if email sending is allowed based on rate limits.
    Raises HTTPException if rate limit is exceeded.
    """
    # Keys for Redis
    last_sent_key = f"email:last_sent:{email}"
    count_key = f"email:count:{email}"
    block_key = f"email:blocked:{email}"

    # Check if user is blocked
    is_blocked = await redis_client.exists(block_key)
    if is_blocked:
        ttl = await redis_client.ttl(block_key)
        raise HTTPException(
            status_code=HTTPStatus.TOO_MANY_REQUESTS,
            detail=f"Too many emails sent. Please wait {int(ttl)/60} minutes."
        )

    # Check cooldown
    last_sent = await redis_client.exists(last_sent_key)
    if last_sent:
        ttl = await redis_client.ttl(last_sent_key)
        raise HTTPException(
            status_code=HTTPStatus.TOO_MANY_REQUESTS,
            detail=f"Please wait {ttl} seconds before sending another email."
        )

    # Check and update email count
    async with redis_client.pipeline() as pipe:
        try:
            # Watch the count key for changes
            await pipe.watch(count_key)

            count = await redis_client.get(count_key)
            count = int(count) if count else 0

            if count >= MAX_EMAILS:
                # Block the user
                pipe.multi()
                await pipe.setex(block_key, EMAIL_BLOCK_TIME, "1")
                await pipe.delete(count_key)
                await pipe.execute()

                raise HTTPException(
                    status_code=HTTPStatus.TOO_MANY_REQUESTS,
                    detail=f"Too many emails sent. Please wait {EMAIL_BLOCK_TIME} seconds."
                )

            # Set cooldown and increment count
            pipe.multi()
            await pipe.setex(last_sent_key, EMAIL_COOLDOWN, "1")
            await pipe.incr(count_key)
            # Set expiration for count key if it's new
            if count == 0:
                await pipe.expire(count_key, EMAIL_BLOCK_TIME)
            await pipe.execute()

        except Exception as e:
            if not isinstance(e, HTTPException):
                raise HTTPException(
                    status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                    detail="Error checking rate limit"
                )
            raise e
        finally:
            await pipe.unwatch()
