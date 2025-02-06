from pydantic import BaseModel, Field


class User(BaseModel):
    email: str = Field(validation_alias="sub")  # For JWT deser.
    name: str

class Newcomer(BaseModel):
    email: str = Field(validation_alias="sub")  # For JWT deser.

class CreateProfileRequest(BaseModel):
    name: str
    avatar_url: str | None = None
