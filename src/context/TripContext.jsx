import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import { calculateFeasibility, calculateBudget } from '../utils/tripUtils'

const TripContext = createContext(null)

export const useTrip = () => {
    const context = useContext(TripContext)
    if (!context) {
        throw new Error('useTrip must be used within a TripProvider')
    }
    return context
}

// Demo data for hackathon
const DEMO_TRIPS = [
    {
        id: 'demo-trip-001',
        name: 'Golden Triangle Adventure',
        description: 'Explore the classic Indian circuit - Delhi, Agra, and Jaipur',
        coverImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
        startDate: '2026-02-15',
        endDate: '2026-02-22',
        status: 'planned',
        isPublic: true,
        shareId: 'golden-triangle-2026',
        totalBudget: 45000,
        currency: 'INR',
        travelerCount: 2,
        cities: [
            {
                id: 'city-delhi',
                name: 'New Delhi',
                country: 'India',
                image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600',
                order: 1,
                days: [
                    {
                        id: 'day-1',
                        date: '2026-02-15',
                        dayNumber: 1,
                        feasibility: 'smooth',
                        activities: [
                            { id: 'act-1', name: 'Arrival at IGI Airport', type: 'transport', time: '10:00', duration: 60, cost: 0 },
                            { id: 'act-2', name: 'Check-in at Hotel Oberoi', type: 'accommodation', time: '12:00', duration: 60, cost: 8000 },
                            { id: 'act-3', name: 'India Gate Visit', type: 'sightseeing', time: '16:00', duration: 120, cost: 0 },
                            { id: 'act-4', name: 'Dinner at Bukhara', type: 'food', time: '20:00', duration: 90, cost: 3000 }
                        ]
                    },
                    {
                        id: 'day-2',
                        date: '2026-02-16',
                        dayNumber: 2,
                        feasibility: 'tight',
                        activities: [
                            { id: 'act-5', name: 'Red Fort Exploration', type: 'sightseeing', time: '09:00', duration: 180, cost: 500 },
                            { id: 'act-6', name: 'Chandni Chowk Food Walk', type: 'food', time: '13:00', duration: 120, cost: 800 },
                            { id: 'act-7', name: 'Qutub Minar', type: 'sightseeing', time: '16:00', duration: 120, cost: 300 },
                            { id: 'act-8', name: 'Lotus Temple', type: 'sightseeing', time: '18:30', duration: 60, cost: 0 },
                            { id: 'act-9', name: 'Hauz Khas Village', type: 'entertainment', time: '20:00', duration: 120, cost: 1500 }
                        ]
                    }
                ]
            },
            {
                id: 'city-agra',
                name: 'Agra',
                country: 'India',
                image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600',
                order: 2,
                days: [
                    {
                        id: 'day-3',
                        date: '2026-02-17',
                        dayNumber: 3,
                        feasibility: 'smooth',
                        activities: [
                            { id: 'act-10', name: 'Train to Agra (Gatimaan Express)', type: 'transport', time: '08:00', duration: 100, cost: 1500 },
                            { id: 'act-11', name: 'Taj Mahal Sunrise', type: 'sightseeing', time: '06:00', duration: 180, cost: 1100 },
                            { id: 'act-12', name: 'Agra Fort', type: 'sightseeing', time: '14:00', duration: 150, cost: 550 },
                            { id: 'act-13', name: 'Mehtab Bagh Sunset', type: 'sightseeing', time: '17:30', duration: 90, cost: 200 }
                        ]
                    },
                    {
                        id: 'day-4',
                        date: '2026-02-18',
                        dayNumber: 4,
                        feasibility: 'smooth',
                        activities: [
                            { id: 'act-14', name: 'Fatehpur Sikri Day Trip', type: 'sightseeing', time: '09:00', duration: 240, cost: 800 },
                            { id: 'act-15', name: 'Local Handicraft Shopping', type: 'shopping', time: '15:00', duration: 120, cost: 2000 },
                            { id: 'act-16', name: 'Mughlai Dinner', type: 'food', time: '20:00', duration: 90, cost: 1200 }
                        ]
                    }
                ]
            },
            {
                id: 'city-jaipur',
                name: 'Jaipur',
                country: 'India',
                image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600',
                order: 3,
                days: [
                    {
                        id: 'day-5',
                        date: '2026-02-19',
                        dayNumber: 5,
                        feasibility: 'overloaded',
                        activities: [
                            { id: 'act-17', name: 'Drive to Jaipur', type: 'transport', time: '07:00', duration: 240, cost: 3000 },
                            { id: 'act-18', name: 'Amber Fort', type: 'sightseeing', time: '12:00', duration: 180, cost: 500 },
                            { id: 'act-19', name: 'Jal Mahal Photo Stop', type: 'sightseeing', time: '16:00', duration: 30, cost: 0 },
                            { id: 'act-20', name: 'Hawa Mahal', type: 'sightseeing', time: '17:00', duration: 60, cost: 200 },
                            { id: 'act-21', name: 'City Palace', type: 'sightseeing', time: '18:30', duration: 90, cost: 700 },
                            { id: 'act-22', name: 'Chokhi Dhani Dinner', type: 'food', time: '20:30', duration: 180, cost: 2500 }
                        ]
                    },
                    {
                        id: 'day-6',
                        date: '2026-02-20',
                        dayNumber: 6,
                        feasibility: 'smooth',
                        activities: [
                            { id: 'act-23', name: 'Nahargarh Fort Sunrise', type: 'sightseeing', time: '06:00', duration: 120, cost: 200 },
                            { id: 'act-24', name: 'Jantar Mantar', type: 'sightseeing', time: '10:00', duration: 90, cost: 200 },
                            { id: 'act-25', name: 'Johari Bazaar Shopping', type: 'shopping', time: '14:00', duration: 180, cost: 5000 }
                        ]
                    },
                    {
                        id: 'day-7',
                        date: '2026-02-21',
                        dayNumber: 7,
                        feasibility: 'smooth',
                        activities: [
                            { id: 'act-26', name: 'Elephant Village Experience', type: 'experience', time: '09:00', duration: 180, cost: 2500 },
                            { id: 'act-27', name: 'Spa & Relaxation', type: 'wellness', time: '15:00', duration: 180, cost: 3000 },
                            { id: 'act-28', name: 'Farewell Dinner', type: 'food', time: '20:00', duration: 120, cost: 2000 }
                        ]
                    },
                    {
                        id: 'day-8',
                        date: '2026-02-22',
                        dayNumber: 8,
                        feasibility: 'smooth',
                        activities: [
                            { id: 'act-29', name: 'Flight back to Delhi', type: 'transport', time: '10:00', duration: 60, cost: 4000 },
                            { id: 'act-30', name: 'Departure', type: 'transport', time: '14:00', duration: 0, cost: 0 }
                        ]
                    }
                ]
            }
        ],
        createdAt: '2026-01-01T10:00:00Z',
        updatedAt: '2026-01-02T15:30:00Z'
    }
]

export const TripProvider = ({ children }) => {
    const [trips, setTrips] = useState([])
    const [currentTrip, setCurrentTrip] = useState(null)
    const [loading, setLoading] = useState(false)
    const [aiSuggestions, setAiSuggestions] = useState([])

    // Initialize with demo data
    useEffect(() => {
        const storedTrips = localStorage.getItem('globetrotter_trips')
        if (storedTrips) {
            setTrips(JSON.parse(storedTrips))
        } else {
            setTrips(DEMO_TRIPS)
            localStorage.setItem('globetrotter_trips', JSON.stringify(DEMO_TRIPS))
        }
    }, [])

    // Save trips to localStorage whenever they change
    useEffect(() => {
        if (trips.length > 0) {
            localStorage.setItem('globetrotter_trips', JSON.stringify(trips))
        }
    }, [trips])

    const fetchTrips = useCallback(async () => {
        setLoading(true)
        try {
            // Try API first, fallback to localStorage
            const response = await api.get('/api/trips')
            setTrips(response.data)
        } catch (error) {
            // Use localStorage in demo mode
            const storedTrips = localStorage.getItem('globetrotter_trips')
            if (storedTrips) {
                setTrips(JSON.parse(storedTrips))
            }
        }
        setLoading(false)
    }, [])

    const getTrip = useCallback((tripId) => {
        return trips.find(t => t.id === tripId) || null
    }, [trips])

    const createTrip = async (tripData) => {
        const newTrip = {
            id: 'trip-' + Date.now(),
            ...tripData,
            cities: [],
            status: 'draft',
            isPublic: false,
            shareId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        setTrips(prev => [...prev, newTrip])
        return newTrip
    }

    const updateTrip = async (tripId, updates) => {
        setTrips(prev => prev.map(trip => {
            if (trip.id === tripId) {
                const updatedTrip = {
                    ...trip,
                    ...updates,
                    updatedAt: new Date().toISOString()
                }
                // Recalculate feasibility for all days
                if (updatedTrip.cities) {
                    updatedTrip.cities = updatedTrip.cities.map(city => ({
                        ...city,
                        days: city.days?.map(day => ({
                            ...day,
                            feasibility: calculateFeasibility(day.activities)
                        }))
                    }))
                }
                return updatedTrip
            }
            return trip
        }))
    }

    const deleteTrip = async (tripId) => {
        setTrips(prev => prev.filter(trip => trip.id !== tripId))
    }

    const addCity = async (tripId, cityData) => {
        setTrips(prev => prev.map(trip => {
            if (trip.id === tripId) {
                const newCity = {
                    id: 'city-' + Date.now(),
                    ...cityData,
                    order: (trip.cities?.length || 0) + 1,
                    days: []
                }
                return {
                    ...trip,
                    cities: [...(trip.cities || []), newCity],
                    updatedAt: new Date().toISOString()
                }
            }
            return trip
        }))
    }

    const updateCity = async (tripId, cityId, updates) => {
        setTrips(prev => prev.map(trip => {
            if (trip.id === tripId) {
                return {
                    ...trip,
                    cities: trip.cities.map(city =>
                        city.id === cityId ? { ...city, ...updates } : city
                    ),
                    updatedAt: new Date().toISOString()
                }
            }
            return trip
        }))
    }

    const removeCity = async (tripId, cityId) => {
        setTrips(prev => prev.map(trip => {
            if (trip.id === tripId) {
                return {
                    ...trip,
                    cities: trip.cities.filter(city => city.id !== cityId),
                    updatedAt: new Date().toISOString()
                }
            }
            return trip
        }))
    }

    const reorderCities = async (tripId, sourceIndex, destIndex) => {
        setTrips(prev => prev.map(trip => {
            if (trip.id === tripId) {
                const newCities = [...trip.cities]
                const [removed] = newCities.splice(sourceIndex, 1)
                newCities.splice(destIndex, 0, removed)

                // Update order numbers
                const reorderedCities = newCities.map((city, index) => ({
                    ...city,
                    order: index + 1
                }))

                return {
                    ...trip,
                    cities: reorderedCities,
                    updatedAt: new Date().toISOString()
                }
            }
            return trip
        }))
    }

    const addDay = async (tripId, cityId, dayData) => {
        setTrips(prev => prev.map(trip => {
            if (trip.id === tripId) {
                return {
                    ...trip,
                    cities: trip.cities.map(city => {
                        if (city.id === cityId) {
                            const newDay = {
                                id: 'day-' + Date.now(),
                                dayNumber: (city.days?.length || 0) + 1,
                                activities: [],
                                feasibility: 'smooth',
                                ...dayData
                            }
                            return {
                                ...city,
                                days: [...(city.days || []), newDay]
                            }
                        }
                        return city
                    }),
                    updatedAt: new Date().toISOString()
                }
            }
            return trip
        }))
    }

    const addActivity = async (tripId, cityId, dayId, activityData) => {
        setTrips(prev => prev.map(trip => {
            if (trip.id === tripId) {
                return {
                    ...trip,
                    cities: trip.cities.map(city => {
                        if (city.id === cityId) {
                            return {
                                ...city,
                                days: city.days.map(day => {
                                    if (day.id === dayId) {
                                        const newActivity = {
                                            id: 'act-' + Date.now(),
                                            ...activityData
                                        }
                                        const updatedActivities = [...(day.activities || []), newActivity]
                                        return {
                                            ...day,
                                            activities: updatedActivities,
                                            feasibility: calculateFeasibility(updatedActivities)
                                        }
                                    }
                                    return day
                                })
                            }
                        }
                        return city
                    }),
                    updatedAt: new Date().toISOString()
                }
            }
            return trip
        }))
    }

    const updateActivity = async (tripId, cityId, dayId, activityId, updates) => {
        setTrips(prev => prev.map(trip => {
            if (trip.id === tripId) {
                return {
                    ...trip,
                    cities: trip.cities.map(city => {
                        if (city.id === cityId) {
                            return {
                                ...city,
                                days: city.days.map(day => {
                                    if (day.id === dayId) {
                                        const updatedActivities = day.activities.map(act =>
                                            act.id === activityId ? { ...act, ...updates } : act
                                        )
                                        return {
                                            ...day,
                                            activities: updatedActivities,
                                            feasibility: calculateFeasibility(updatedActivities)
                                        }
                                    }
                                    return day
                                })
                            }
                        }
                        return city
                    }),
                    updatedAt: new Date().toISOString()
                }
            }
            return trip
        }))
    }

    const removeActivity = async (tripId, cityId, dayId, activityId) => {
        setTrips(prev => prev.map(trip => {
            if (trip.id === tripId) {
                return {
                    ...trip,
                    cities: trip.cities.map(city => {
                        if (city.id === cityId) {
                            return {
                                ...city,
                                days: city.days.map(day => {
                                    if (day.id === dayId) {
                                        const updatedActivities = day.activities.filter(act => act.id !== activityId)
                                        return {
                                            ...day,
                                            activities: updatedActivities,
                                            feasibility: calculateFeasibility(updatedActivities)
                                        }
                                    }
                                    return day
                                })
                            }
                        }
                        return city
                    }),
                    updatedAt: new Date().toISOString()
                }
            }
            return trip
        }))
    }

    const moveActivity = async (tripId, sourceCityId, sourceDayId, destCityId, destDayId, activityId, destIndex) => {
        setTrips(prev => prev.map(trip => {
            if (trip.id === tripId) {
                let movedActivity = null

                // Remove from source and capture the activity
                const citiesAfterRemove = trip.cities.map(city => {
                    if (city.id === sourceCityId) {
                        return {
                            ...city,
                            days: city.days.map(day => {
                                if (day.id === sourceDayId) {
                                    const activity = day.activities.find(a => a.id === activityId)
                                    movedActivity = activity
                                    const updatedActivities = day.activities.filter(a => a.id !== activityId)
                                    return {
                                        ...day,
                                        activities: updatedActivities,
                                        feasibility: calculateFeasibility(updatedActivities)
                                    }
                                }
                                return day
                            })
                        }
                    }
                    return city
                })

                // Add to destination
                const citiesAfterAdd = citiesAfterRemove.map(city => {
                    if (city.id === destCityId) {
                        return {
                            ...city,
                            days: city.days.map(day => {
                                if (day.id === destDayId && movedActivity) {
                                    const newActivities = [...day.activities]
                                    newActivities.splice(destIndex, 0, movedActivity)
                                    return {
                                        ...day,
                                        activities: newActivities,
                                        feasibility: calculateFeasibility(newActivities)
                                    }
                                }
                                return day
                            })
                        }
                    }
                    return city
                })

                return {
                    ...trip,
                    cities: citiesAfterAdd,
                    updatedAt: new Date().toISOString()
                }
            }
            return trip
        }))
    }

    const generateShareLink = async (tripId) => {
        const shareId = 'share-' + tripId + '-' + Date.now().toString(36)
        await updateTrip(tripId, { isPublic: true, shareId })
        return `${window.location.origin}/share/${shareId}`
    }

    const getSharedTrip = (shareId) => {
        return trips.find(t => t.shareId === shareId) || null
    }

    const copyTrip = async (tripId) => {
        const originalTrip = trips.find(t => t.id === tripId)
        if (!originalTrip) return null

        const copiedTrip = {
            ...originalTrip,
            id: 'trip-' + Date.now(),
            name: originalTrip.name + ' (Copy)',
            isPublic: false,
            shareId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        setTrips(prev => [...prev, copiedTrip])
        return copiedTrip
    }

    const getTripBudget = useCallback((tripId) => {
        const trip = trips.find(t => t.id === tripId)
        if (!trip) return null
        return calculateBudget(trip)
    }, [trips])

    // AI Suggestions
    const getAiSuggestions = async (tripId, context) => {
        setLoading(true)
        try {
            const response = await api.post('/api/ai/suggestions', { tripId, context })
            setAiSuggestions(response.data.suggestions)
        } catch (error) {
            // Demo suggestions
            setAiSuggestions([
                { type: 'activity', text: 'Visit the local morning market for authentic breakfast', cost: 200 },
                { type: 'tip', text: 'Book train tickets at least 2 weeks in advance for better prices' },
                { type: 'activity', text: 'Consider a sunset boat ride on the river', cost: 500 },
                { type: 'warning', text: 'This day seems packed. Consider moving one activity to another day.' }
            ])
        }
        setLoading(false)
    }

    const value = {
        trips,
        currentTrip,
        setCurrentTrip,
        loading,
        aiSuggestions,
        fetchTrips,
        getTrip,
        createTrip,
        updateTrip,
        deleteTrip,
        addCity,
        updateCity,
        removeCity,
        reorderCities,
        addDay,
        addActivity,
        updateActivity,
        removeActivity,
        moveActivity,
        generateShareLink,
        getSharedTrip,
        copyTrip,
        getTripBudget,
        getAiSuggestions
    }

    return (
        <TripContext.Provider value={value}>
            {children}
        </TripContext.Provider>
    )
}
