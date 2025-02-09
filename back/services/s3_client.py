import boto3
import boto3.session
from settings import SETTINGS

s3_client = boto3.client(
    "s3",
    aws_access_key_id=SETTINGS.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=SETTINGS.AWS_SECRET_ACCESS_KEY.get_secret_value(),
    region_name=SETTINGS.AWS_REGION,
    config=boto3.session.Config(s3={'addressing_style': 'path'})
)