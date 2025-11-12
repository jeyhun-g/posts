from pydantic import BaseModel, HttpUrl, Field, field_validator
from src.server.dynamodb import Categories


class BlogCreateRequest(BaseModel):
    title: str
    url: HttpUrl
    category: str
    keywords: list[str] = Field(..., min_length=1)
    
    @field_validator('category')
    @classmethod
    def validate_category(cls, v: str) -> str:
        valid_categories = [cat.value for cat in Categories]
        if v not in valid_categories:
            raise ValueError(f'Category must be one of: {", ".join(valid_categories)}')
        return v

