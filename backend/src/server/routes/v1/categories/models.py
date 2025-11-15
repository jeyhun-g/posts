from pydantic import BaseModel


class CategoriesResponse(BaseModel):
    categories: list[str]

