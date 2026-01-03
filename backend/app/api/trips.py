from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from datetime import datetime
import uuid
from ..models.schemas import Trip, TripCreate, TripUpdate, City, Day, Activity
from ..core.security import get_current_user

router = APIRouter(prefix="/trips", tags=["Trips"])

# In-memory trip storage for demo mode
trips_db: dict = {}

# Helper function to generate unique IDs
def generate_id(prefix: str = "id") -> str:
    return f"{prefix}-{uuid.uuid4().hex[:12]}"

@router.get("/", response_model=List[Trip])
async def get_trips(current_user: dict = Depends(get_current_user)):
    """Get all trips for current user"""
    user_id = current_user.get("id")
    user_trips = [trip for trip in trips_db.values() if trip["user_id"] == user_id]
    return user_trips

@router.post("/", response_model=Trip)
async def create_trip(
    trip_data: TripCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new trip"""
    user_id = current_user.get("id")
    trip_id = generate_id("trip")
    
    new_trip = {
        "id": trip_id,
        "user_id": user_id,
        **trip_data.model_dump(),
        "cities": [],
        "status": "draft",
        "is_public": False,
        "share_id": None,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    trips_db[trip_id] = new_trip
    return new_trip

@router.get("/{trip_id}", response_model=Trip)
async def get_trip(
    trip_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific trip"""
    trip = trips_db.get(trip_id)
    
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found"
        )
    
    # Check ownership or if public
    if trip["user_id"] != current_user.get("id") and not trip.get("is_public"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this trip"
        )
    
    return trip

@router.put("/{trip_id}", response_model=Trip)
async def update_trip(
    trip_id: str,
    updates: TripUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a trip"""
    trip = trips_db.get(trip_id)
    
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found"
        )
    
    if trip["user_id"] != current_user.get("id"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this trip"
        )
    
    update_data = updates.model_dump(exclude_unset=True)
    trip.update(update_data)
    trip["updated_at"] = datetime.utcnow().isoformat()
    
    return trip

@router.delete("/{trip_id}")
async def delete_trip(
    trip_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a trip"""
    trip = trips_db.get(trip_id)
    
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found"
        )
    
    if trip["user_id"] != current_user.get("id"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this trip"
        )
    
    del trips_db[trip_id]
    return {"message": "Trip deleted successfully"}

# City routes
@router.post("/{trip_id}/cities")
async def add_city(
    trip_id: str,
    city_data: dict,
    current_user: dict = Depends(get_current_user)
):
    """Add a city to a trip"""
    trip = trips_db.get(trip_id)
    
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    city_id = generate_id("city")
    new_city = {
        "id": city_id,
        **city_data,
        "order": len(trip["cities"]) + 1,
        "days": []
    }
    
    trip["cities"].append(new_city)
    trip["updated_at"] = datetime.utcnow().isoformat()
    
    return new_city

@router.delete("/{trip_id}/cities/{city_id}")
async def remove_city(
    trip_id: str,
    city_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Remove a city from a trip"""
    trip = trips_db.get(trip_id)
    
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    trip["cities"] = [c for c in trip["cities"] if c["id"] != city_id]
    trip["updated_at"] = datetime.utcnow().isoformat()
    
    return {"message": "City removed"}

# Day routes
@router.post("/{trip_id}/cities/{city_id}/days")
async def add_day(
    trip_id: str,
    city_id: str,
    day_data: dict,
    current_user: dict = Depends(get_current_user)
):
    """Add a day to a city"""
    trip = trips_db.get(trip_id)
    
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    city = next((c for c in trip["cities"] if c["id"] == city_id), None)
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    
    day_id = generate_id("day")
    new_day = {
        "id": day_id,
        **day_data,
        "day_number": len(city["days"]) + 1,
        "activities": [],
        "feasibility": "smooth"
    }
    
    city["days"].append(new_day)
    trip["updated_at"] = datetime.utcnow().isoformat()
    
    return new_day

# Activity routes
@router.post("/{trip_id}/cities/{city_id}/days/{day_id}/activities")
async def add_activity(
    trip_id: str,
    city_id: str,
    day_id: str,
    activity_data: dict,
    current_user: dict = Depends(get_current_user)
):
    """Add an activity to a day"""
    trip = trips_db.get(trip_id)
    
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    city = next((c for c in trip["cities"] if c["id"] == city_id), None)
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    
    day = next((d for d in city["days"] if d["id"] == day_id), None)
    if not day:
        raise HTTPException(status_code=404, detail="Day not found")
    
    activity_id = generate_id("act")
    new_activity = {
        "id": activity_id,
        **activity_data
    }
    
    day["activities"].append(new_activity)
    
    # Update feasibility
    day["feasibility"] = calculate_feasibility(day["activities"])
    trip["updated_at"] = datetime.utcnow().isoformat()
    
    return new_activity

@router.delete("/{trip_id}/cities/{city_id}/days/{day_id}/activities/{activity_id}")
async def remove_activity(
    trip_id: str,
    city_id: str,
    day_id: str,
    activity_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Remove an activity from a day"""
    trip = trips_db.get(trip_id)
    
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    city = next((c for c in trip["cities"] if c["id"] == city_id), None)
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    
    day = next((d for d in city["days"] if d["id"] == day_id), None)
    if not day:
        raise HTTPException(status_code=404, detail="Day not found")
    
    day["activities"] = [a for a in day["activities"] if a["id"] != activity_id]
    day["feasibility"] = calculate_feasibility(day["activities"])
    trip["updated_at"] = datetime.utcnow().isoformat()
    
    return {"message": "Activity removed"}

# Share trip
@router.post("/{trip_id}/share")
async def share_trip(
    trip_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Generate a share link for a trip"""
    trip = trips_db.get(trip_id)
    
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    if trip["user_id"] != current_user.get("id"):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    share_id = f"share-{trip_id}-{uuid.uuid4().hex[:8]}"
    trip["is_public"] = True
    trip["share_id"] = share_id
    trip["updated_at"] = datetime.utcnow().isoformat()
    
    return {"share_id": share_id, "is_public": True}

# Get shared trip
@router.get("/shared/{share_id}")
async def get_shared_trip(share_id: str):
    """Get a publicly shared trip"""
    trip = next(
        (t for t in trips_db.values() if t.get("share_id") == share_id),
        None
    )
    
    if not trip or not trip.get("is_public"):
        raise HTTPException(status_code=404, detail="Shared trip not found")
    
    return trip

# Copy trip
@router.post("/{trip_id}/copy")
async def copy_trip(
    trip_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Copy a trip to current user's account"""
    original = trips_db.get(trip_id)
    
    if not original:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    new_trip_id = generate_id("trip")
    copied_trip = {
        **original,
        "id": new_trip_id,
        "user_id": current_user.get("id"),
        "name": f"{original['name']} (Copy)",
        "is_public": False,
        "share_id": None,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    trips_db[new_trip_id] = copied_trip
    return copied_trip

def calculate_feasibility(activities: list) -> str:
    """Calculate day feasibility based on activities"""
    if not activities:
        return "smooth"
    
    total_time = sum(a.get("duration", 0) for a in activities)
    activity_count = len(activities)
    
    if activity_count > 5 or total_time > 720:  # 12 hours
        return "overloaded"
    elif activity_count > 3 or total_time > 480:  # 8 hours
        return "tight"
    
    return "smooth"
