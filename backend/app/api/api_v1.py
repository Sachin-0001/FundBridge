from fastapi import APIRouter
from app.api.endpoints import user, auth, business, bank, application, admin

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(user.router, prefix="/users", tags=["users"])
api_router.include_router(business.router, prefix="/business", tags=["business"])
api_router.include_router(bank.router, prefix="/bank", tags=["bank"])
api_router.include_router(application.router, prefix="/applications", tags=["applications"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
