from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.database import get_db
from app.models import User
from app.schemas import UserResponse, UserCreate

router = APIRouter(tags=["auth"])

@router.get("/auth/users", response_model=List[UserResponse])
async def get_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users

@router.get("/auth/me", response_model=UserResponse)
async def get_current_user_profile(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    users = result.scalars().all()
    if not users:
        # Create default user if none exists
        default_user = User(
            public_member_id="USR-7K2M9A",
            email="alex@devworkspace.ai",
            full_name="Alex Tech Lead",
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            availability_status="online",
            role="Software Architect & Project Lead"
        )
        db.add(default_user)
        await db.commit()
        await db.refresh(default_user)
        return default_user
    return users[0]

@router.post("/auth/register", response_model=UserResponse)
async def register_user(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(User).where(User.email == payload.email))
    if existing.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=payload.email,
        full_name=payload.full_name,
        avatar_url=payload.avatar_url,
        availability_status=payload.availability_status,
        role=payload.role
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
