import google.generativeai as genai
from typing import List, Optional
import json
import re
from ..core.config import settings

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)

class AIService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-flash')
    
    async def get_activity_suggestions(
        self, 
        city_name: str, 
        country: str, 
        trip_type: str = "leisure",
        budget: str = "moderate"
    ) -> List[dict]:
        """Generate activity suggestions for a city"""
        prompt = f"""You are a travel expert. Suggest 5 unique activities for a traveler visiting {city_name}, {country}. 
        Consider: {trip_type} trip, {budget} budget.
        
        Return a JSON array with this exact format:
        [
            {{
                "name": "Activity Name",
                "type": "sightseeing|food|entertainment|shopping|experience|adventure|wellness",
                "description": "Brief description",
                "duration": 120,
                "estimatedCost": 500,
                "bestTime": "Morning|Afternoon|Evening"
            }}
        ]
        
        Only return the JSON array, no other text."""
        
        try:
            response = self.model.generate_content(prompt)
            text = response.text
            
            # Extract JSON from response
            json_match = re.search(r'\[[\s\S]*\]', text)
            if json_match:
                return json.loads(json_match.group())
            return self._get_default_suggestions(city_name)
        except Exception as e:
            print(f"AI suggestion error: {e}")
            return self._get_default_suggestions(city_name)
    
    async def generate_day_summary(
        self, 
        city_name: str, 
        activities: List[str]
    ) -> str:
        """Generate a summary for a travel day"""
        activities_str = ', '.join(activities) if activities else 'No activities planned'
        
        prompt = f"""Create a brief, engaging 2-sentence summary of this travel day in {city_name}:
        Activities: {activities_str}
        
        Make it sound exciting and personal. Only return the summary text."""
        
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f"Day summary error: {e}")
            return "An exciting day of exploration awaits!"
    
    async def generate_packing_list(
        self, 
        destinations: List[str], 
        duration: int,
        trip_type: str = "leisure"
    ) -> dict:
        """Generate a packing list for a trip"""
        destinations_str = ', '.join(destinations)
        
        prompt = f"""Create a packing list for a {duration}-day {trip_type} trip to {destinations_str}.
        
        Return a JSON object with categories:
        {{
            "essentials": ["item1", "item2"],
            "clothing": ["item1", "item2"],
            "toiletries": ["item1", "item2"],
            "electronics": ["item1", "item2"],
            "documents": ["item1", "item2"],
            "misc": ["item1", "item2"]
        }}
        
        Keep each category to 5-8 items. Only return the JSON."""
        
        try:
            response = self.model.generate_content(prompt)
            text = response.text
            
            json_match = re.search(r'\{[\s\S]*\}', text)
            if json_match:
                return json.loads(json_match.group())
            return self._get_default_packing_list()
        except Exception as e:
            print(f"Packing list error: {e}")
            return self._get_default_packing_list()
    
    async def generate_travel_tips(
        self, 
        city_name: str, 
        country: str
    ) -> List[dict]:
        """Generate travel tips for a destination"""
        prompt = f"""Give 5 essential travel tips for visiting {city_name}, {country}.
        
        Return a JSON array:
        [
            {{
                "tip": "Tip text",
                "category": "safety|money|culture|transport|food"
            }}
        ]
        
        Only return the JSON array."""
        
        try:
            response = self.model.generate_content(prompt)
            text = response.text
            
            json_match = re.search(r'\[[\s\S]*\]', text)
            if json_match:
                return json.loads(json_match.group())
            return []
        except Exception as e:
            print(f"Travel tips error: {e}")
            return []
    
    def _get_default_suggestions(self, city_name: str) -> List[dict]:
        """Default suggestions fallback"""
        return [
            {"name": f"Explore {city_name} Old Town", "type": "sightseeing", "duration": 180, "estimatedCost": 0, "description": "Discover the historic heart of the city"},
            {"name": "Local Food Tour", "type": "food", "duration": 120, "estimatedCost": 800, "description": "Taste authentic local cuisine"},
            {"name": "Sunset Viewpoint", "type": "experience", "duration": 90, "estimatedCost": 200, "description": "Enjoy panoramic views at golden hour"},
            {"name": "Local Market Visit", "type": "shopping", "duration": 120, "estimatedCost": 1000, "description": "Shop for local crafts and souvenirs"},
            {"name": "Cultural Performance", "type": "entertainment", "duration": 120, "estimatedCost": 500, "description": "Experience traditional arts and music"}
        ]
    
    def _get_default_packing_list(self) -> dict:
        """Default packing list fallback"""
        return {
            "essentials": ["Passport", "Wallet", "Phone", "Charger", "Medications"],
            "clothing": ["Comfortable shoes", "Light jacket", "Casual wear", "Sleepwear"],
            "toiletries": ["Toothbrush", "Sunscreen", "Shampoo", "Deodorant"],
            "electronics": ["Phone charger", "Power bank", "Camera", "Headphones"],
            "documents": ["ID copies", "Travel insurance", "Booking confirmations", "Emergency contacts"],
            "misc": ["Snacks", "Water bottle", "Umbrella", "First aid kit"]
        }

# Singleton instance
ai_service = AIService()
