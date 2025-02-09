from pydantic import BaseModel
from typing import Literal
from typing import Optional
from datetime import datetime


class EmailSendResponse(BaseModel):
    status: str
    message: str
    from_email: str


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


class OAuthLinkResponse(BaseModel):
    url: str


class TokenResponse(BaseModel):
    new_user: bool
    access_token: str
    token_type: str
