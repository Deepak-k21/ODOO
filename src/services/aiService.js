import api from './api'

const GEMINI_API_KEY = 'AIzaSyD91y0CZOPQAfdw5uYQkc91Lb05Snt4TJk'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

// AI Service for Gemini integration
export const aiService = {
    // Generate activity suggestions based on city and context
    async getActivitySuggestions(city, context = {}) {
        try {
            const prompt = `You are a travel expert. Suggest 5 unique activities for a traveler visiting ${city.name}, ${city.country}. 
      Consider: ${context.tripType || 'leisure'} trip, ${context.budget || 'moderate'} budget.
      
      Return a JSON array with this exact format:
      [
        {
          "name": "Activity Name",
          "type": "sightseeing|food|entertainment|shopping|experience|adventure|wellness",
          "description": "Brief description",
          "duration": 120,
          "estimatedCost": 500,
          "bestTime": "Morning|Afternoon|Evening"
        }
      ]
      
      Only return the JSON array, no other text.`

            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1024
                    }
                })
            })

            const data = await response.json()
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]'

            // Extract JSON from response
            const jsonMatch = text.match(/\[[\s\S]*\]/)
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0])
            }
            return []
        } catch (error) {
            console.error('AI suggestion error:', error)
            return getDefaultSuggestions(city.name)
        }
    },

    // Generate day summary
    async generateDaySummary(day, cityName) {
        try {
            const activities = day.activities?.map(a => a.name).join(', ') || 'No activities planned'

            const prompt = `Create a brief, engaging 2-sentence summary of this travel day in ${cityName}:
      Activities: ${activities}
      
      Make it sound exciting and personal. Only return the summary text.`

            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.8,
                        maxOutputTokens: 150
                    }
                })
            })

            const data = await response.json()
            return data.candidates?.[0]?.content?.parts?.[0]?.text || 'An exciting day of exploration awaits!'
        } catch (error) {
            console.error('Day summary error:', error)
            return 'An exciting day of exploration awaits!'
        }
    },

    // Generate packing list
    async generatePackingList(trip) {
        try {
            const cities = trip.cities?.map(c => c.name).join(', ') || 'unknown destination'
            const duration = trip.cities?.reduce((sum, c) => sum + (c.days?.length || 0), 0) || 7

            const prompt = `Create a packing list for a ${duration}-day trip to ${cities}.
      
      Return a JSON object with categories:
      {
        "essentials": ["item1", "item2"],
        "clothing": ["item1", "item2"],
        "toiletries": ["item1", "item2"],
        "electronics": ["item1", "item2"],
        "documents": ["item1", "item2"],
        "misc": ["item1", "item2"]
      }
      
      Keep each category to 5-8 items. Only return the JSON.`

            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.5,
                        maxOutputTokens: 512
                    }
                })
            })

            const data = await response.json()
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}'

            const jsonMatch = text.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0])
            }
            return getDefaultPackingList()
        } catch (error) {
            console.error('Packing list error:', error)
            return getDefaultPackingList()
        }
    },

    // Generate travel tips
    async generateTravelTips(city) {
        try {
            const prompt = `Give 5 essential travel tips for visiting ${city.name}, ${city.country}.
      
      Return a JSON array:
      [
        {
          "tip": "Tip text",
          "category": "safety|money|culture|transport|food"
        }
      ]
      
      Only return the JSON array.`

            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.6,
                        maxOutputTokens: 512
                    }
                })
            })

            const data = await response.json()
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]'

            const jsonMatch = text.match(/\[[\s\S]*\]/)
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0])
            }
            return []
        } catch (error) {
            console.error('Travel tips error:', error)
            return []
        }
    },

    // Regenerate specific part of itinerary
    async regenerateItineraryPart(trip, partType, context) {
        try {
            let prompt = ''

            switch (partType) {
                case 'day':
                    prompt = `Suggest a better arrangement for Day ${context.dayNumber} in ${context.cityName}. 
          Current activities: ${context.activities?.map(a => a.name).join(', ')}
          
          Return improved activities as JSON array with format:
          [{"name": "Activity", "type": "type", "time": "HH:MM", "duration": 120, "cost": 500}]`
                    break
                case 'city':
                    prompt = `Suggest 3 must-do activities in ${context.cityName} that aren't in this list: 
          ${context.existingActivities?.join(', ')}
          
          Return as JSON array: [{"name": "Activity", "type": "type", "description": "desc", "duration": 120, "estimatedCost": 500}]`
                    break
                default:
                    return null
            }

            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 512
                    }
                })
            })

            const data = await response.json()
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]'

            const jsonMatch = text.match(/\[[\s\S]*\]/)
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0])
            }
            return []
        } catch (error) {
            console.error('Regenerate error:', error)
            return []
        }
    }
}

// Default suggestions fallback
function getDefaultSuggestions(cityName) {
    return [
        { name: `Explore ${cityName} Old Town`, type: 'sightseeing', duration: 180, estimatedCost: 0 },
        { name: 'Local Food Tour', type: 'food', duration: 120, estimatedCost: 800 },
        { name: 'Sunset Viewpoint', type: 'experience', duration: 90, estimatedCost: 200 },
        { name: 'Local Market Visit', type: 'shopping', duration: 120, estimatedCost: 1000 },
        { name: 'Cultural Performance', type: 'entertainment', duration: 120, estimatedCost: 500 }
    ]
}

// Default packing list fallback
function getDefaultPackingList() {
    return {
        essentials: ['Passport', 'Wallet', 'Phone', 'Charger', 'Medications'],
        clothing: ['Comfortable shoes', 'Light jacket', 'Casual wear', 'Sleepwear'],
        toiletries: ['Toothbrush', 'Sunscreen', 'Shampoo', 'Deodorant'],
        electronics: ['Phone charger', 'Power bank', 'Camera', 'Headphones'],
        documents: ['ID copies', 'Travel insurance', 'Booking confirmations', 'Emergency contacts'],
        misc: ['Snacks', 'Water bottle', 'Umbrella', 'First aid kit']
    }
}

export default aiService
