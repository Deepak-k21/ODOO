import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    MapPin, Calendar, Clock, Wallet, Globe2, Copy, ArrowRight,
    CheckCircle, AlertTriangle, XCircle, Heart, Share2, User
} from 'lucide-react'
import { useTrip } from '../context/TripContext'
import { useAuth } from '../context/AuthContext'
import { formatCurrency, formatDate, getActivityIcon, getActivityColor, getFeasibilityLabel, getTripDuration } from '../utils/tripUtils'
import toast from 'react-hot-toast'

const SharedItinerary = () => {
    const { shareId } = useParams()
    const navigate = useNavigate()
    const { getSharedTrip, copyTrip, getTripBudget } = useTrip()
    const { isAuthenticated, demoLogin } = useAuth()

    const [trip, setTrip] = useState(null)
    const [budget, setBudget] = useState(null)
    const [loading, setLoading] = useState(true)
    const [liked, setLiked] = useState(false)

    useEffect(() => {
        // Simulate loading shared trip
        setTimeout(() => {
            const sharedTrip = getSharedTrip(shareId)
            if (sharedTrip) {
                setTrip(sharedTrip)
                setBudget(getTripBudget(sharedTrip.id))
            }
            setLoading(false)
        }, 500)
    }, [shareId, getSharedTrip, getTripBudget])

    const handleCopyTrip = async () => {
        if (!isAuthenticated) {
            await demoLogin()
        }
        const copiedTrip = await copyTrip(trip.id)
        if (copiedTrip) {
            toast.success('Trip copied to your account!')
            navigate(`/app/trip/${copiedTrip.id}/builder`)
        }
    }

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied!')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        )
    }

    if (!trip) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-12 text-center max-w-md"
                >
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center mx-auto mb-6">
                        <Globe2 className="w-10 h-10 text-primary-400" />
                    </div>
                    <h1 className="heading-md mb-4">Trip Not Found</h1>
                    <p className="text-white/60 mb-6">This shared itinerary doesn't exist or has been removed.</p>
                    <Link to="/">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary"
                        >
                            Go to Home
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        )
    }

    const totalDays = trip.cities?.reduce((sum, city) => sum + (city.days?.length || 0), 0) || 0
    const totalActivities = trip.cities?.reduce((sum, city) =>
        sum + city.days?.reduce((daySum, day) =>
            daySum + (day.activities?.length || 0), 0) || 0, 0) || 0

    return (
        <div className="min-h-screen">
            <div className="animated-bg"></div>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 glass-card-dark border-b border-white/5">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                            <Globe2 className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-xl gradient-text">GlobeTrotter</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleShare}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <Share2 className="w-4 h-4" />
                            Share
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCopyTrip}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Copy className="w-4 h-4" />
                            Copy This Trip
                        </motion.button>
                    </div>
                </div>
            </header>

            <main className="pt-24 pb-12 px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Cover */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative h-80 md:h-96 rounded-3xl overflow-hidden mb-8"
                    >
                        <img
                            src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200'}
                            alt={trip.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                        <div className="absolute bottom-8 left-8 right-8">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm flex items-center gap-1">
                                    <Globe2 className="w-4 h-4" />
                                    Public Itinerary
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-3">{trip.name}</h1>
                            <p className="text-white/70 text-lg max-w-2xl">
                                {trip.description || 'An amazing travel adventure awaits!'}
                            </p>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setLiked(!liked)}
                            className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
                        >
                            <Heart className={`w-6 h-6 transition-colors ${liked ? 'fill-primary-500 text-primary-500' : 'text-white'}`} />
                        </motion.button>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
                    >
                        <div className="glass-card p-4 text-center">
                            <Calendar className="w-5 h-5 mx-auto mb-2 text-secondary-400" />
                            <div className="font-bold">{totalDays} Days</div>
                            <div className="text-xs text-white/50">Duration</div>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <MapPin className="w-5 h-5 mx-auto mb-2 text-primary-400" />
                            <div className="font-bold">{trip.cities?.length || 0} Cities</div>
                            <div className="text-xs text-white/50">Destinations</div>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <Clock className="w-5 h-5 mx-auto mb-2 text-accent-400" />
                            <div className="font-bold">{totalActivities}</div>
                            <div className="text-xs text-white/50">Activities</div>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <Wallet className="w-5 h-5 mx-auto mb-2 text-green-400" />
                            <div className="font-bold">{formatCurrency(budget?.total || 0)}</div>
                            <div className="text-xs text-white/50">Est. Cost</div>
                        </div>
                        <div className="glass-card p-4 text-center col-span-2 md:col-span-1">
                            <User className="w-5 h-5 mx-auto mb-2 text-purple-400" />
                            <div className="font-bold">{trip.travelerCount || 2}</div>
                            <div className="text-xs text-white/50">Travelers</div>
                        </div>
                    </motion.div>

                    {/* Trip Story */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <h2 className="heading-md mb-6">Trip Journey</h2>

                        {trip.cities?.map((city, cityIndex) => (
                            <motion.div
                                key={city.id}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + cityIndex * 0.1 }}
                                className="mb-8"
                            >
                                {/* City Header */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden">
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
                                    <div className="ml-auto flex gap-2">
                                        {city.days?.map((day, i) => (
                                            <div
                                                key={i}
                                                className={`w-2 h-8 rounded-full ${day.feasibility === 'smooth' ? 'bg-green-500' :
                                                        day.feasibility === 'tight' ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Days */}
                                <div className="relative pl-8 border-l-2 border-white/10 space-y-4">
                                    {city.days?.map((day, dayIndex) => (
                                        <motion.div
                                            key={day.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 + dayIndex * 0.05 }}
                                            className="relative"
                                        >
                                            <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500" />

                                            <div className="glass-card p-5">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/30 to-secondary-500/30 flex items-center justify-center font-bold text-sm">
                                                            {day.dayNumber}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold">Day {day.dayNumber}</h4>
                                                            <p className="text-xs text-white/50">{formatDate(day.date, 'long')}</p>
                                                        </div>
                                                    </div>
                                                    <span className={getFeasibilityLabel(day.feasibility).class}>
                                                        {getFeasibilityLabel(day.feasibility).text}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    {day.activities?.map((activity, actIndex) => (
                                                        <motion.div
                                                            key={activity.id}
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: 0.5 + actIndex * 0.03 }}
                                                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-sm"
                                                        >
                                                            <span className="text-lg">{getActivityIcon(activity.type)}</span>
                                                            <span>{activity.name}</span>
                                                            <span className="text-xs text-accent-400">{formatCurrency(activity.cost || 0)}</span>
                                                        </motion.div>
                                                    ))}
                                                </div>

                                                {(!day.activities || day.activities.length === 0) && (
                                                    <p className="text-white/40 text-sm">No activities planned</p>
                                                )}
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
                                            className="flex items-center gap-2 text-white/20"
                                        >
                                            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-white/20" />
                                            <ArrowRight className="w-5 h-5" />
                                            <div className="w-16 h-0.5 bg-gradient-to-r from-white/20 to-transparent" />
                                        </motion.div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="glass-card p-8 text-center"
                    >
                        <h3 className="heading-md mb-4">Love this itinerary?</h3>
                        <p className="text-white/60 mb-6">Copy it to your account and customize it to your preferences!</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCopyTrip}
                            className="btn-primary text-lg px-8 py-4"
                        >
                            Copy This Trip
                        </motion.button>
                    </motion.div>
                </div>
            </main>
        </div>
    )
}

export default SharedItinerary
