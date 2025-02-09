from settings import SETTINGS
import resend
from services.jwt import create_email_code


resend.api_key = SETTINGS.resend_api_key.get_secret_value()


async def send_confirmation_email(state: str, address: str):
    link = f'{SETTINGS.frontend_url}/login?code={create_email_code(address)}&state={state}'

    params: resend.Emails.SendParams = {
        "from": SETTINGS.email_sender,
        "to": [address],
        "subject": "bHackathon",
        "html": f'<a href="{link}">{link}</a>',
    }

    email = resend.Emails.send(params)
    print(email)
