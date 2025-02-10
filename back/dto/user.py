from pydantic import BaseModel, Field, UUID4
from typing import List
from dto.quests import UserAnswer


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


class UserState(BaseModel):
    of_user: UUID4
    answers: List[UserAnswer]

UserState.update_forward_refs()
