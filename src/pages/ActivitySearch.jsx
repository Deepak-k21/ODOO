import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, ArrowLeft, Plus, Filter, Clock, Wallet, Sparkles } from 'lucide-react'
import { useTrip } from '../context/TripContext'
import { aiService } from '../services/aiService'
import { getActivityIcon, getActivityColor, formatCurrency } from '../utils/tripUtils'
import toast from 'react-hot-toast'

const SAMPLE_ACTIVITIES = [
    { name: 'Taj Mahal Sunrise Tour', type: 'sightseeing', duration: 180, cost: 1500, description: 'Experience the iconic monument at dawn' },
    { name: 'Street Food Walking Tour', type: 'food', duration: 120, cost: 800, description: 'Taste authentic local delicacies' },
    { name: 'City Palace Visit', type: 'culture', duration: 150, cost: 500, description: 'Explore royal heritage and architecture' },
    { name: 'Local Market Shopping', type: 'shopping', duration: 120, cost: 2000, description: 'Shop for handicrafts and souvenirs' },
    { name: 'Sunset Boat Ride', type: 'experience', duration: 90, cost: 600, description: 'Enjoy scenic views from the water' },
    { name: 'Temple Visit', type: 'culture', duration: 60, cost: 0, description: 'Spiritual experience at ancient temples' },
    { name: 'Cooking Class', type: 'experience', duration: 180, cost: 1200, description: 'Learn to cook traditional dishes' },
    { name: 'Night Market Tour', type: 'entertainment', duration: 150, cost: 500, description: 'Experience vibrant nightlife' },
    { name: 'Spa & Wellness', type: 'wellness', duration: 120, cost: 2500, description: 'Rejuvenate with traditional treatments' },
    { name: 'Adventure Trek', type: 'adventure', duration: 240, cost: 1500, description: 'Explore scenic trails and viewpoints' },
]

const ActivitySearch = () => {
    const { tripId } = useParams()
    const navigate = useNavigate()
    const { getTrip, addActivity } = useTrip()

    const [trip, setTrip] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedType, setSelectedType] = useState('all')
    const [selectedCity, setSelectedCity] = useState(null)
    const [selectedDay, setSelectedDay] = useState(null)
    const [aiSuggestions, setAiSuggestions] = useState([])
    const [loadingAi, setLoadingAi] = useState(false)

    const activityTypes = [
        'all', 'sightseeing', 'food', 'culture', 'shopping',
        'experience', 'entertainment', 'wellness', 'adventure'
    ]

    useEffect(() => {
        const tripData = getTrip(tripId)
        setTrip(tripData)
        if (tripData?.cities?.length > 0) {
            setSelectedCity(tripData.cities[0])
            if (tripData.cities[0].days?.length > 0) {
                setSelectedDay(tripData.cities[0].days[0])
            }
        }
    }, [tripId, getTrip])

    const filteredActivities = SAMPLE_ACTIVITIES.filter(activity => {
        const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = selectedType === 'all' || activity.type === selectedType
        return matchesSearch && matchesType
    })

    const handleAddActivity = async (activity) => {
        if (!selectedCity || !selectedDay) {
            toast.error('Please select a city and day first')
            return
        }

        await addActivity(tripId, selectedCity.id, selectedDay.id, {
            name: activity.name,
            type: activity.type,
            duration: activity.duration,
            cost: activity.cost,
            time: '09:00'
        })

        toast.success(`${activity.name} added!`)
        // Refresh trip data
        setTrip(getTrip(tripId))
    }

    const getAiSuggestions = async () => {
        if (!selectedCity) return

        setLoadingAi(true)
        try {
            const suggestions = await aiService.getActivitySuggestions(selectedCity, {
                tripType: trip?.tripType || 'leisure'
            })
            setAiSuggestions(suggestions)
        } catch (error) {
            console.error('AI suggestion error:', error)
            toast.error('Failed to get AI suggestions')
        }
        setLoadingAi(false)
    }

    if (!trip) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(`/app/trip/${tripId}/builder`)}
                        className="p-2 rounded-lg hover:bg-white/10"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </motion.button>
                    <div>
                        <h1 className="heading-md">Add Activities</h1>
                        <p className="text-white/60">Find activities for {trip.name}</p>
                    </div>
                </div>
            </div>

            {/* City & Day Selection */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Select City</label>
                    <select
                        value={selectedCity?.id || ''}
                        onChange={(e) => {
                            const city = trip.cities.find(c => c.id === e.target.value)
                            setSelectedCity(city)
                            setSelectedDay(city?.days?.[0] || null)
                        }}
                        className="input-glass w-full"
                    >
                        {trip.cities?.map(city => (
                            <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Select Day</label>
                    <select
                        value={selectedDay?.id || ''}
                        onChange={(e) => {
                            const day = selectedCity?.days?.find(d => d.id === e.target.value)
                            setSelectedDay(day)
                        }}
                        className="input-glass w-full"
                    >
                        {selectedCity?.days?.map(day => (
                            <option key={day.id} value={day.id}>Day {day.dayNumber}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search activities..."
                        className="input-glass pl-12 w-full"
                    />
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={getAiSuggestions}
                    disabled={loadingAi}
                    className="btn-primary flex items-center gap-2"
                >
                    {loadingAi ? (
                        <div className="spinner w-5 h-5" />
                    ) : (
                        <Sparkles className="w-5 h-5" />
                    )}
                    AI Suggestions
                </motion.button>
            </div>

            {/* Type Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
                {activityTypes.map(type => (
                    <motion.button
                        key={type}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedType(type)}
                        className={`px-4 py-2 rounded-full transition-all ${selectedType === type
                                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                                : 'bg-white/5 hover:bg-white/10 text-white/70'
                            }`}
                    >
                        {type === 'all' ? 'All' : (
                            <>
                                {getActivityIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
                            </>
                        )}
                    </motion.button>
                ))}
            </div>

            {/* AI Suggestions */}
            {aiSuggestions.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-accent-400" />
                        AI Suggestions for {selectedCity?.name}
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {aiSuggestions.map((activity, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className="glass-card p-4 border border-accent-500/30"
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                                        style={{ backgroundColor: getActivityColor(activity.type) + '20' }}
                                    >
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium">{activity.name}</h4>
                                        <p className="text-xs text-white/50 mb-2">{activity.description}</p>
                                        <div className="flex items-center gap-3 text-xs text-white/60">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {activity.duration}min
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Wallet className="w-3 h-3" />
                                                {formatCurrency(activity.estimatedCost || 0)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleAddActivity({
                                        name: activity.name,
                                        type: activity.type,
                                        duration: activity.duration || 120,
                                        cost: activity.estimatedCost || 0
                                    })}
                                    className="w-full mt-3 py-2 rounded-lg bg-accent-500/20 text-accent-400 hover:bg-accent-500/30 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add to Day {selectedDay?.dayNumber}
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Activities Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredActivities.map((activity, index) => (
                    <motion.div
                        key={activity.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        className="glass-card p-4"
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                                style={{ backgroundColor: getActivityColor(activity.type) + '20' }}
                            >
                                {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium">{activity.name}</h4>
                                <p className="text-sm text-white/50 mb-2">{activity.description}</p>
                                <div className="flex items-center gap-3 text-sm text-white/60">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {activity.duration}min
                                    </span>
                                    <span className="flex items-center gap-1 text-accent-400">
                                        <Wallet className="w-4 h-4" />
                                        {formatCurrency(activity.cost)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAddActivity(activity)}
                            className="w-full mt-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add to Day {selectedDay?.dayNumber || '--'}
                        </motion.button>
                    </motion.div>
                ))}
            </div>

            {filteredActivities.length === 0 && (
                <div className="text-center py-12">
                    <Filter className="w-12 h-12 mx-auto mb-4 text-white/20" />
                    <p className="text-white/50">No activities found</p>
                </div>
            )}
        </motion.div>
    )
}

export default ActivitySearch
