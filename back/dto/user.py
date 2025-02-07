from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class User(BaseModel):
    email: str = Field(validation_alias="sub")  # For JWT deser.
    name: str

class CreateProfileRequest(BaseModel):
    name: str
    avatar_url: str | None = None

class GitHubUser(BaseModel):
    login: str
    id: int
    avatar_url: str
    name: Optional[str] = None
    email: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    blog: Optional[str] = None
    twitter_username: Optional[str] = None
    public_repos: int
    followers: int
    following: int
    created_at: datetime
    updated_at: datetime
