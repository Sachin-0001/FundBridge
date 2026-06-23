from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.api import deps
from app.core.security import create_access_token, verify_password, get_password_hash
from app.config.settings import settings
from app.models.user import User
from app.schemas.user import UserCreate, User as UserSchema, Token, UserLogin, UserWithProfile
from app.models.business import BusinessProfile
from app.models.bank import BankProfile

router = APIRouter()

@router.post("/register", response_model=UserSchema)
async def register(
    user_in: UserCreate,
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    # Check if user exists
    result = await db.execute(select(User).where(User.email == user_in.email))
    user = result.scalars().first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    user = User(
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        role=user_in.role
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@router.post("/login", response_model=Token)
async def login(
    user_in: UserLogin,
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    # Authenticate user
    result = await db.execute(select(User).where(User.email == user_in.email))
    user = result.scalars().first()
    
    if not user or not verify_password(user_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.get("/me", response_model=UserWithProfile)
async def read_user_me(
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    profile = None
    if current_user.role == "BUSINESS":
        result = await db.execute(select(BusinessProfile).where(BusinessProfile.user_id == current_user.id))
        profile = result.scalars().first()
    elif current_user.role == "BANK":
        result = await db.execute(select(BankProfile).where(BankProfile.user_id == current_user.id))
        profile = result.scalars().first()

    return {
        **current_user.__dict__,
        "profile": profile
    }
