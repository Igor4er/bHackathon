
from fastapi import APIRouter, File, UploadFile, HTTPException
from settings import SETTINGS
from services.s3_client import s3_client

router = APIRouter(prefix="/media", tags=["Media"])

@router.post("/upload_file/")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_key = f"uploads/{file.filename}"  # Path inside the bucket

        s3_client.upload_fileobj(file.file, SETTINGS.S3_BUCKET_NAME, file_key)

        file_url = f"https://{SETTINGS.S3_BUCKET_NAME}.s3.{SETTINGS.AWS_REGION}.amazonaws.com/{file_key}"

        return {"message": "File uploaded successfully", "file_url": file_url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get("/download/{file_name}")
def get_presigned_url(file_name: str):
    try:
        url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": SETTINGS.S3_BUCKET_NAME, "Key": f"uploads/{file_name}"},
            ExpiresIn=3600,  # URL expires in 1 hour
        )
        return {"url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def delete_file(file_name: str):
    try:
        s3_client.delete_object(Bucket=SETTINGS.S3_BUCKET_NAME, Key=f"uploads/{file_name}")
        return {"message": "File deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
