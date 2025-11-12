from fastapi import APIRouter
from .healthcheck.router import router as healthcheck_router
from .blogs.router import router as blogs_router

router = APIRouter()

router.include_router(healthcheck_router, prefix="/healthcheck", tags=["healthcheck"])
router.include_router(blogs_router, prefix="/blogs", tags=["blogs"])

