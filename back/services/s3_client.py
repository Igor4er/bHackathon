import boto3
from settings import SETTINGS

s3_client = boto3.client(
    "s3",
    aws_access_key_id=SETTINGS.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=SETTINGS.AWS_SECRET_ACCESS_KEY,
    region_name=SETTINGS.AWS_REGION
)