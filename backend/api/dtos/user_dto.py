from pydantic import BaseModel, EmailStr, Field


class CreateUserDTO(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr = Field(..., max_length=255)
    password: str = Field(..., min_length=6, max_length=255)
