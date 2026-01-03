from fastapi import APIRouter, HTTPException, status, Depends
from datetime import timedelta
from typing import Dict
from ..models.schemas import UserCreate, UserLogin, UserResponse, Token
from ..core.security import (
    get_password_hash, verify_password, create_access_token, get_current_user
)
from ..core.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

# In-memory user storage for demo mode
users_db: Dict[str, dict] = {
    "demo@globetrotter.com": {
        "id": "demo-user-001",
        "email": "demo@globetrotter.com",
        "name": "Demo Traveler",
        "hashed_password": get_password_hash("demo123"),
        "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
    }
}

@router.post("/signup", response_model=Token)
async def signup(user_data: UserCreate):
    """Register a new user"""
    if user_data.email in users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user_id = f"user-{len(users_db) + 1}"
    
    new_user = {
        "id": user_id,
        "email": user_data.email,
        "name": user_data.name,
        "hashed_password": get_password_hash(user_data.password),
        "avatar": None
    }
    
    users_db[user_data.email] = new_user
    
    access_token = create_access_token(
        data={"sub": user_data.email, "id": user_id}
    )
    
    return Token(
        access_token=access_token,
        user=UserResponse(
            id=user_id,
            email=user_data.email,
            name=user_data.name
        )
    )

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin):
    """Login user"""
    user = users_db.get(user_data.email)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not verify_password(user_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    access_token = create_access_token(
        data={"sub": user["email"], "id": user["id"]}
    )
    
    return Token(
        access_token=access_token,
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            avatar=user.get("avatar")
        )
    )

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user info"""
    email = current_user.get("sub") or current_user.get("email")
    
    # Demo mode
    if current_user.get("is_demo"):
        return UserResponse(
            id="demo-user-001",
            email="demo@globetrotter.com",
            name="Demo Traveler",
            avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
        )
    
    user = users_db.get(email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        avatar=user.get("avatar")
    )

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    updates: dict,
    current_user: dict = Depends(get_current_user)
):
    """Update user profile"""
    email = current_user.get("sub") or current_user.get("email")
    
    if email in users_db:
        user = users_db[email]
        if "name" in updates:
            user["name"] = updates["name"]
        if "avatar" in updates:
            user["avatar"] = updates["avatar"]
        
        return UserResponse(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            avatar=user.get("avatar")
        )
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User not found"
    )
