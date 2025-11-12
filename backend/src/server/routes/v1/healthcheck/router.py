import os
from fastapi import APIRouter

router = APIRouter()

@router.get("")
async def healthcheck():
    """Health check endpoint"""
    service_name = os.getenv("SERVICE_NAME")
    return {"service_name": service_name, "status": "okay"}

