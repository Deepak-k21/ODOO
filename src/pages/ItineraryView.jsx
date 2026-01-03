import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    MapPin, ArrowLeft, ArrowRight, Calendar, Wallet, Clock,
    CheckCircle, AlertTriangle, XCircle, Share2, Copy, Globe2, Sparkles
} from 'lucide-react'
import { useTrip } from '../context/TripContext'
import { aiService } from '../services/aiService'
import { formatCurrency, formatDate, getActivityIcon, getActivityColor, getFeasibilityLabel } from '../utils/tripUtils'
import toast from 'react-hot-toast'

const ItineraryView = () => {
    const { tripId } = useParams()
    const navigate = useNavigate()
    const { getTrip, getTripBudget, generateShareLink } = useTrip()

    const [trip, setTrip] = useState(null)
    const [budget, setBudget] = useState(null)
    const [daySummaries, setDaySummaries] = useState({})
    const [loadingSummary, setLoadingSummary] = useState(null)

    useEffect(() => {
        const tripData = getTrip(tripId)
        const budgetData = getTripBudget(tripId)
        setTrip(tripData)
        setBudget(budgetData)
    }, [tripId, getTrip, getTripBudget])

    const handleShare = async () => {
        const link = await generateShareLink(tripId)
        navigator.clipboard.writeText(link)
        toast.success('Share link copied to clipboard!')
    }

    const generateSummary = async (day, cityName) => {
        if (daySummaries[day.id]) return

        setLoadingSummary(day.id)
        try {
            const summary = await aiService.generateDaySummary(day, cityName)
            setDaySummaries(prev => ({ ...prev, [day.id]: summary }))
        } catch (error) {
            console.error('Failed to generate summary:', error)
        }
        setLoadingSummary(null)
    }

    if (!trip) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="spinner"></div>
            </div>
        )
    }

    const totalDays = trip.cities?.reduce((sum, city) => sum + (city.days?.length || 0), 0) || 0

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-5xl mx-auto"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
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
                        <h1 className="heading-md">{trip.name}</h1>
                        <div className="flex items-center gap-4 text-sm text-white/60 mt-1">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                            </span>
                            <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {trip.cities?.length || 0} cities
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {totalDays} days
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleShare}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <Share2 className="w-4 h-4" />
                        Share
                    </motion.button>
                    <Link to={`/app/trip/${tripId}/builder`}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary flex items-center gap-2"
                        >
                            Edit
                        </motion.button>
                    </Link>
                </div>
            </div>

            {/* Cover Image */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative h-64 rounded-3xl overflow-hidden mb-8"
            >
                <img
                    src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200'}
                    alt={trip.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                    <h2 className="text-3xl font-bold mb-2">{trip.name}</h2>
                    <p className="text-white/70">{trip.description || 'An amazing travel adventure awaits!'}</p>
                </div>
                {trip.isPublic && (
                    <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400">
                        <Globe2 className="w-4 h-4" />
                        Public
                    </div>
                )}
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-4 text-center"
                >
                    <div className="text-2xl font-bold gradient-text">{trip.cities?.length || 0}</div>
                    <div className="text-sm text-white/50">Cities</div>
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-4 text-center"
                >
                    <div className="text-2xl font-bold gradient-text">{totalDays}</div>
                    <div className="text-sm text-white/50">Days</div>
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-4 text-center"
                >
                    <div className="text-2xl font-bold gradient-text">
                        {trip.cities?.reduce((sum, city) =>
                            sum + city.days?.reduce((daySum, day) =>
                                daySum + (day.activities?.length || 0), 0) || 0, 0) || 0}
                    </div>
                    <div className="text-sm text-white/50">Activities</div>
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-4 text-center"
                >
                    <div className="text-2xl font-bold text-accent-400">{formatCurrency(budget?.total || 0)}</div>
                    <div className="text-sm text-white/50">Total Budget</div>
                </motion.div>
            </div>

            {/* Itinerary */}
            <div className="space-y-8">
                {trip.cities?.map((city, cityIndex) => (
                    <motion.div
                        key={city.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: cityIndex * 0.1 }}
                    >
                        {/* City Header */}
                        <div className="relative mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden">
                                    <img
                                        src={city.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200'}
                                        alt={city.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">{city.name}</h3>
                                    <p className="text-white/60">{city.country} • {city.days?.length || 0} days</p>
                                </div>
                            </div>
                        </div>

                        {/* Days Timeline */}
                        <div className="relative pl-8 border-l-2 border-white/10 space-y-6">
                            {city.days?.map((day, dayIndex) => (
                                <motion.div
                                    key={day.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: (cityIndex * city.days.length + dayIndex) * 0.05 }}
                                    className="relative"
                                >
                                    {/* Timeline Node */}
                                    <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500" />

                                    <div className="glass-card p-6">
                                        {/* Day Header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center font-bold">
                                                    {day.dayNumber}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">Day {day.dayNumber}</h4>
                                                    <p className="text-sm text-white/50">{formatDate(day.date, 'long')}</p>
                                                </div>
                                            </div>
                                            <span className={getFeasibilityLabel(day.feasibility).class}>
                                                {getFeasibilityLabel(day.feasibility).text}
                                            </span>
                                        </div>

                                        {/* AI Summary */}
                                        <div className="mb-4 p-4 rounded-xl bg-white/5">
                                            {daySummaries[day.id] ? (
                                                <p className="text-white/70 italic">{daySummaries[day.id]}</p>
                                            ) : (
                                                <button
                                                    onClick={() => generateSummary(day, city.name)}
                                                    disabled={loadingSummary === day.id}
                                                    className="flex items-center gap-2 text-accent-400 hover:text-accent-300"
                                                >
                                                    {loadingSummary === day.id ? (
                                                        <>
                                                            <div className="spinner w-4 h-4" />
                                                            Generating summary...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Sparkles className="w-4 h-4" />
                                                            Generate AI Summary
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        {/* Activities */}
                                        <div className="space-y-3">
                                            {day.activities?.map((activity, actIndex) => (
                                                <motion.div
                                                    key={activity.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: actIndex * 0.03 }}
                                                    className="flex items-center gap-4 p-3 rounded-xl bg-white/5"
                                                >
                                                    <div
                                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                                                        style={{ backgroundColor: getActivityColor(activity.type) + '20' }}
                                                    >
                                                        {getActivityIcon(activity.type)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h5 className="font-medium">{activity.name}</h5>
                                                        <div className="flex items-center gap-3 text-xs text-white/50">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {activity.time}
                                                            </span>
                                                            <span>{activity.duration} min</span>
                                                            <span style={{ color: getActivityColor(activity.type) }}>
                                                                {activity.type}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-medium text-accent-400">
                                                            {formatCurrency(activity.cost || 0)}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Day Total */}
                                        <div className="flex justify-end mt-4 pt-4 border-t border-white/10">
                                            <div className="text-right">
                                                <div className="text-sm text-white/50">Day Total</div>
                                                <div className="font-bold text-lg">
                                                    {formatCurrency(day.activities?.reduce((sum, a) => sum + (a.cost || 0), 0) || 0)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* City Connector */}
                        {cityIndex < (trip.cities?.length || 0) - 1 && (
                            <div className="flex items-center justify-center py-6">
                                <motion.div
                                    animate={{ x: [0, 10, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="flex items-center gap-2 text-white/30"
                                >
                                    <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-white/30" />
                                    <ArrowRight className="w-5 h-5" />
                                    <div className="w-16 h-0.5 bg-gradient-to-r from-white/30 to-transparent" />
                                </motion.div>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Budget Summary */}
            {budget && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-6 mt-8"
                >
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-accent-400" />
                        Budget Summary
                    </h3>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <div className="text-sm text-white/50 mb-1">Total Budget</div>
                            <div className="text-2xl font-bold">{formatCurrency(trip.totalBudget || 0)}</div>
                        </div>
                        <div>
                            <div className="text-sm text-white/50 mb-1">Estimated Cost</div>
                            <div className="text-2xl font-bold text-accent-400">{formatCurrency(budget.total)}</div>
                        </div>
                        <div>
                            <div className="text-sm text-white/50 mb-1">
                                {budget.remaining >= 0 ? 'Remaining' : 'Over Budget'}
                            </div>
                            <div className={`text-2xl font-bold ${budget.remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {formatCurrency(Math.abs(budget.remaining))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    )
}

export default ItineraryView
