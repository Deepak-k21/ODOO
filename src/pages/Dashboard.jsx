import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus, MapPin, Calendar, Wallet, TrendingUp, Clock, Plane,
    ChevronRight, Star, Globe2, Sparkles, ArrowUpRight, Users,
    CheckCircle, AlertTriangle, XCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTrip } from '../context/TripContext'
import { formatCurrency, formatDate, getTripDuration, getFeasibilityLabel } from '../utils/tripUtils'

const Dashboard = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { trips, getTripBudget } = useTrip()
    const [greeting, setGreeting] = useState('')
    const [selectedTrip, setSelectedTrip] = useState(null)

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) setGreeting('Good Morning')
        else if (hour < 18) setGreeting('Good Afternoon')
        else setGreeting('Good Evening')
    }, [])

    const upcomingTrips = trips.filter(trip => {
        const tripDate = new Date(trip.startDate)
        return tripDate > new Date()
    }).slice(0, 3)

    const recentTrips = trips.slice(0, 4)

    const calculateStats = () => {
        let totalCities = 0
        let totalDays = 0
        let totalSpent = 0
        let smoothDays = 0
        let tightDays = 0
        let overloadedDays = 0

        trips.forEach(trip => {
            trip.cities?.forEach(city => {
                totalCities++
                city.days?.forEach(day => {
                    totalDays++
                    if (day.feasibility === 'smooth') smoothDays++
                    else if (day.feasibility === 'tight') tightDays++
                    else if (day.feasibility === 'overloaded') overloadedDays++

                    day.activities?.forEach(act => {
                        totalSpent += act.cost || 0
                    })
                })
            })
        })

        return { totalCities, totalDays, totalSpent, smoothDays, tightDays, overloadedDays }
    }

    const stats = calculateStats()

    const quickActions = [
        { icon: Plus, label: 'New Trip', path: '/app/create-trip', color: 'from-primary-500 to-pink-500' },
        { icon: MapPin, label: 'My Trips', path: '/app/my-trips', color: 'from-secondary-500 to-cyan-500' },
        { icon: Sparkles, label: 'AI Planner', path: '/app/create-trip', color: 'from-accent-500 to-orange-500' },
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto space-y-8"
        >
            {/* Dashboard Header */}
            <motion.div
                variants={itemVariants}
                className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2"
            >
                <div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-primary-400 mb-4"
                    >
                        <Sparkles className="w-3 h-3" />
                        AI-Powered Travel Design
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="heading-lg mb-2 flex items-center gap-4 flex-wrap"
                    >
                        {greeting},
                        <span className="gradient-text italic px-1">{user?.name?.split(' ')[0] || 'Traveler'}</span>
                        <motion.span
                            animate={{ rotate: [0, 10, 0, -10, 0] }}
                            transition={{ duration: 5, repeat: Infinity }}
                        >
                            ✈️
                        </motion.span>
                    </motion.h1>
                    <p className="text-white/40 text-lg font-medium max-w-xl leading-relaxed">
                        Your next adventure is calling. Where shall we take you today?
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/app/create-trip" className="no-underline">
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary flex items-center gap-3 px-8 py-4 shadow-xl shadow-primary-500/20"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="font-bold">Plan New Trip</span>
                        </motion.button>
                    </Link>
                </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                    <Link key={action.label} to={action.path}>
                        <motion.div
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            className="glass-card p-6 group cursor-pointer relative overflow-hidden"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                            <div className="relative flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg`}>
                                    <action.icon className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{action.label}</h3>
                                    <p className="text-sm text-white/50">Click to get started</p>
                                </div>
                                <ChevronRight className="w-5 h-5 ml-auto text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                            <Plane className="w-5 h-5 text-primary-400" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">{trips.length}</div>
                    <div className="text-sm text-white/50">Total Trips</div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary-500/20 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-secondary-400" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">{stats.totalCities}</div>
                    <div className="text-sm text-white/50">Cities Explored</div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-accent-400" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">{stats.totalDays}</div>
                    <div className="text-sm text-white/50">Days Planned</div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-green-400" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">{formatCurrency(stats.totalSpent)}</div>
                    <div className="text-sm text-white/50">Total Budgeted</div>
                </motion.div>
            </motion.div>

            {/* Feasibility Overview */}
            <motion.div variants={itemVariants} className="glass-card p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary-400" />
                    Trip Feasibility Overview
                </h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-green-400 font-medium">Smooth</span>
                        </div>
                        <div className="text-3xl font-bold text-green-400">{stats.smoothDays}</div>
                        <div className="text-sm text-white/50">days</div>
                    </div>

                    <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-400" />
                            <span className="text-yellow-400 font-medium">Tight</span>
                        </div>
                        <div className="text-3xl font-bold text-yellow-400">{stats.tightDays}</div>
                        <div className="text-sm text-white/50">days</div>
                    </div>

                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <XCircle className="w-5 h-5 text-red-400" />
                            <span className="text-red-400 font-medium">Overloaded</span>
                        </div>
                        <div className="text-3xl font-bold text-red-400">{stats.overloadedDays}</div>
                        <div className="text-sm text-white/50">days</div>
                    </div>
                </div>
            </motion.div>

            {/* Recent Trips */}
            <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Clock className="w-5 h-5 text-secondary-400" />
                        Recent Trips
                    </h3>
                    <Link to="/app/my-trips" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
                        View All <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>

                {recentTrips.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center mx-auto mb-4">
                            <Plane className="w-10 h-10 text-primary-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No trips yet</h3>
                        <p className="text-white/60 mb-6">Start planning your first adventure!</p>
                        <Link to="/app/create-trip">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-primary"
                            >
                                Create Your First Trip
                            </motion.button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                        {recentTrips.map((trip, index) => {
                            const budget = getTripBudget(trip.id)
                            const duration = getTripDuration(trip.startDate, trip.endDate)

                            return (
                                <motion.div
                                    key={trip.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    onClick={() => navigate(`/app/trip/${trip.id}/builder`)}
                                    className="glass-card overflow-hidden cursor-pointer group"
                                >
                                    <div className="relative h-40">
                                        <img
                                            src={trip.coverImage || trip.cities?.[0]?.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600'}
                                            alt={trip.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="font-bold text-lg mb-1">{trip.name}</h3>
                                            <div className="flex items-center gap-3 text-sm text-white/70">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {trip.cities?.length || 0} cities
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {duration} days
                                                </span>
                                            </div>
                                        </div>
                                        {trip.isPublic && (
                                            <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs flex items-center gap-1">
                                                <Globe2 className="w-3 h-3" />
                                                Public
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Wallet className="w-4 h-4 text-accent-400" />
                                                <span className="font-medium">{formatCurrency(budget?.total || 0)}</span>
                                            </div>
                                            <span className="text-sm text-white/50">
                                                {formatDate(trip.startDate)}
                                            </span>
                                        </div>

                                        {/* Feasibility indicators */}
                                        <div className="flex gap-1 mt-3">
                                            {trip.cities?.flatMap(city => city.days || []).slice(0, 8).map((day, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1.5 flex-1 rounded-full ${day.feasibility === 'smooth' ? 'bg-green-500' :
                                                        day.feasibility === 'tight' ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </motion.div>

            {/* AI Tip */}
            <motion.div
                variants={itemVariants}
                className="glass-card p-6 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/20 to-accent-500/10 rounded-full blur-3xl" />
                <div className="relative flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                            AI Travel Tip
                            <span className="px-2 py-0.5 rounded-full bg-accent-500/20 text-accent-400 text-xs">Powered by Gemini</span>
                        </h3>
                        <p className="text-white/70">
                            Based on your travel patterns, we recommend booking flights for your next trip at least 6-8 weeks in advance
                            for the best prices. Consider visiting Jaipur in February for the best weather and fewer crowds!
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default Dashboard
