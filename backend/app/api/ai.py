from fastapi import APIRouter, HTTPException
from typing import List
from ..models.schemas import AISuggestionRequest, AISuggestion, AIPackingListRequest
from ..services.ai_service import ai_service

router = APIRouter(prefix="/ai", tags=["AI"])

@router.post("/suggestions", response_model=List[dict])
async def get_activity_suggestions(request: AISuggestionRequest):
    """Get AI-powered activity suggestions for a city"""
    suggestions = await ai_service.get_activity_suggestions(
        city_name=request.city_name,
        country=request.country,
        trip_type=request.trip_type or "leisure",
        budget=request.budget or "moderate"
    )
    return suggestions

@router.post("/day-summary")
async def generate_day_summary(
    city_name: str,
    activities: List[str]
):
    """Generate an AI summary for a day"""
    summary = await ai_service.generate_day_summary(
        city_name=city_name,
        activities=activities
    )
    return {"summary": summary}

@router.post("/packing-list")
async def generate_packing_list(request: AIPackingListRequest):
    """Generate an AI-powered packing list"""
    packing_list = await ai_service.generate_packing_list(
        destinations=request.destinations,
        duration=request.duration,
        trip_type=request.trip_type
    )
    return packing_list

@router.post("/travel-tips")
async def get_travel_tips(city_name: str, country: str):
    """Get AI-generated travel tips for a destination"""
    tips = await ai_service.generate_travel_tips(
        city_name=city_name,
        country=country
    )
    return {"tips": tips}
