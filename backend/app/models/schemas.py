from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, schema):
        schema.update(type="string")
        return schema

# User Models
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    avatar: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

class UserInDB(UserBase):
    id: str
    hashed_password: str
    avatar: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Activity Model
class ActivityBase(BaseModel):
    name: str
    type: str = "sightseeing"
    time: str = "09:00"
    duration: int = 120  # minutes
    cost: float = 0
    notes: Optional[str] = None

class Activity(ActivityBase):
    id: str

# Day Model
class DayBase(BaseModel):
    date: str
    day_number: int = 1
    notes: Optional[str] = None

class Day(DayBase):
    id: str
    activities: List[Activity] = []
    feasibility: str = "smooth"  # smooth, tight, overloaded

# City Model
class CityBase(BaseModel):
    name: str
    country: str
    image: Optional[str] = None

class City(CityBase):
    id: str
    order: int = 1
    days: List[Day] = []

# Trip Models
class TripBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: str
    end_date: str
    traveler_count: int = 2
    total_budget: float = 50000
    currency: str = "INR"
    trip_type: str = "leisure"
    cover_image: Optional[str] = None

class TripCreate(TripBase):
    pass

class TripUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    traveler_count: Optional[int] = None
    total_budget: Optional[float] = None
    currency: Optional[str] = None
    trip_type: Optional[str] = None
    cover_image: Optional[str] = None
    status: Optional[str] = None
    is_public: Optional[bool] = None

class Trip(TripBase):
    id: str
    user_id: str
    cities: List[City] = []
    status: str = "draft"  # draft, planned, completed
    is_public: bool = False
    share_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Token Models
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# AI Models
class AISuggestionRequest(BaseModel):
    city_name: str
    country: str
    trip_type: Optional[str] = "leisure"
    budget: Optional[str] = "moderate"

class AISuggestion(BaseModel):
    name: str
    type: str
    description: Optional[str] = None
    duration: int = 120
    estimated_cost: float = 0
    best_time: Optional[str] = None

class AITripSummaryRequest(BaseModel):
    trip_id: str
    day_id: Optional[str] = None

class AIPackingListRequest(BaseModel):
    destinations: List[str]
    duration: int
    trip_type: str = "leisure"
