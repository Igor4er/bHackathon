from pydantic import BaseModel

class Media(BaseModel):
    media_link: str

class MediaText(Media):
    text: str
