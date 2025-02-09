from pydantic import BaseModel, Field


class User(BaseModel):
    email: str = Field(validation_alias="sub")  # For JWT deser.
    name: str


class UserProfileResponse(BaseModel):
    name: str
    email: str
    avatar_url: str | None

class UpdateProfileRequest(BaseModel):
    name: str | None = None
    avatar_url: str | None = None
