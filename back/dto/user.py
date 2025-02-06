from pydantic import BaseModel, Field


class User(BaseModel):
    email: str = Field(validation_alias="sub")  # For JWT deser.
