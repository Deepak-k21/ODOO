import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    Calendar, ArrowLeft, ChevronLeft, ChevronRight, Clock,
    CheckCircle, AlertTriangle, XCircle, MapPin
} from 'lucide-react'
import { useTrip } from '../context/TripContext'
import { formatDate, formatCurrency, getActivityIcon, getActivityColor, getFeasibilityLabel } from '../utils/tripUtils'

const TripCalendar = () => {
    const { tripId } = useParams()
    const navigate = useNavigate()
    const { getTrip } = useTrip()

    const [trip, setTrip] = useState(null)
    const [selectedDay, setSelectedDay] = useState(null)
    const [currentMonth, setCurrentMonth] = useState(new Date())

    useEffect(() => {
        const tripData = getTrip(tripId)
        setTrip(tripData)
        if (tripData?.startDate) {
            setCurrentMonth(new Date(tripData.startDate))
        }
    }, [tripId, getTrip])

    if (!trip) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="spinner"></div>
            </div>
        )
    }

    // Get all days from the trip
    const tripDays = trip.cities?.flatMap(city =>
        city.days?.map(day => ({
            ...day,
            city: city.name,
            cityId: city.id
        })) || []
    ) || []

    // Create a map of dates to day data
    const dayMap = {}
    tripDays.forEach(day => {
        if (day.date) {
            dayMap[day.date] = day
        }
    })

    // Calendar helpers
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentMonth)
        const firstDay = getFirstDayOfMonth(currentMonth)
        const days = []

        // Previous month's trailing days
        for (let i = 0; i < firstDay; i++) {
            days.push({ day: null, isCurrentMonth: false })
        }

        // Current month's days
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
            days.push({
                day: i,
                date: dateStr,
                isCurrentMonth: true,
                tripDay: dayMap[dateStr]
            })
        }

        return days
    }

    const calendarDays = generateCalendarDays()
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    const navigateMonth = (direction) => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev)
            newMonth.setMonth(prev.getMonth() + direction)
            return newMonth
        })
    }

    const getFeasibilityIcon = (feasibility) => {
        switch (feasibility) {
            case 'smooth': return <CheckCircle className="w-3 h-3 text-green-400" />
            case 'tight': return <AlertTriangle className="w-3 h-3 text-yellow-400" />
            case 'overloaded': return <XCircle className="w-3 h-3 text-red-400" />
            default: return null
        }
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
                        <h1 className="heading-md flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-secondary-400" />
                            Trip Calendar
                        </h1>
                        <p className="text-white/60">{trip.name}</p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 glass-card p-6"
                >
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-6">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigateMonth(-1)}
                            className="p-2 rounded-lg hover:bg-white/10"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </motion.button>
                        <h2 className="text-xl font-semibold">
                            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h2>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigateMonth(1)}
                            className="p-2 rounded-lg hover:bg-white/10"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </motion.button>
                    </div>

                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 gap-2 mb-2">
                        {weekdays.map(day => (
                            <div key={day} className="text-center text-sm text-white/50 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                        {calendarDays.map((item, index) => {
                            const isSelected = selectedDay?.date === item.date
                            const hasTripDay = !!item.tripDay

                            return (
                                <motion.div
                                    key={index}
                                    whileHover={item.isCurrentMonth ? { scale: 1.05 } : {}}
                                    onClick={() => item.tripDay && setSelectedDay(item.tripDay)}
                                    className={`aspect-square p-2 rounded-xl relative cursor-pointer transition-all ${!item.isCurrentMonth ? 'opacity-0' :
                                            isSelected ? 'bg-gradient-to-br from-primary-500 to-secondary-500' :
                                                hasTripDay ? 'bg-white/10 hover:bg-white/20' : 'hover:bg-white/5'
                                        }`}
                                >
                                    {item.isCurrentMonth && (
                                        <>
                                            <span className={`text-sm ${!hasTripDay && !isSelected ? 'text-white/40' : ''}`}>
                                                {item.day}
                                            </span>

                                            {hasTripDay && (
                                                <div className="absolute bottom-1 left-1 right-1">
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-[10px] text-white/60 truncate">
                                                            {item.tripDay.city}
                                                        </div>
                                                        {getFeasibilityIcon(item.tripDay.feasibility)}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-6 mt-6 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="text-sm text-white/60">Smooth</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <span className="text-sm text-white/60">Tight</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span className="text-sm text-white/60">Overloaded</span>
                        </div>
                    </div>
                </motion.div>

                {/* Day Details */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-6"
                >
                    {selectedDay ? (
                        <>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center font-bold text-lg">
                                    {selectedDay.dayNumber}
                                </div>
                                <div>
                                    <h3 className="font-semibold">Day {selectedDay.dayNumber}</h3>
                                    <p className="text-sm text-white/60">{formatDate(selectedDay.date, 'long')}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="w-4 h-4 text-primary-400" />
                                <span className="font-medium">{selectedDay.city}</span>
                            </div>

                            <div className="mb-4">
                                <span className={getFeasibilityLabel(selectedDay.feasibility).class}>
                                    {getFeasibilityLabel(selectedDay.feasibility).text}
                                </span>
                            </div>

                            <h4 className="font-medium mb-3 text-white/70">Activities</h4>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar">
                                {selectedDay.activities?.map((activity, index) => (
                                    <motion.div
                                        key={activity.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="p-3 rounded-xl bg-white/5"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                                                style={{ backgroundColor: getActivityColor(activity.type) + '20' }}
                                            >
                                                {getActivityIcon(activity.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-medium text-sm truncate">{activity.name}</h5>
                                                <div className="flex items-center gap-2 text-xs text-white/50 mt-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{activity.time}</span>
                                                    <span>•</span>
                                                    <span>{activity.duration}min</span>
                                                </div>
                                            </div>
                                            <div className="text-sm font-medium text-accent-400">
                                                {formatCurrency(activity.cost || 0)}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {(!selectedDay.activities || selectedDay.activities.length === 0) && (
                                <div className="text-center py-8 text-white/40">
                                    No activities planned
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <Calendar className="w-12 h-12 mx-auto mb-4 text-white/20" />
                            <p className="text-white/40">Select a day to view details</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Timeline View */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6 mt-6"
            >
                <h3 className="font-semibold text-lg mb-6">Trip Timeline</h3>
                <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-secondary-500 to-accent-500" />

                    <div className="space-y-6">
                        {tripDays.map((day, index) => (
                            <motion.div
                                key={day.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.05 }}
                                className="flex items-start gap-6 pl-12 relative"
                            >
                                {/* Timeline Node */}
                                <div className="absolute left-4 w-4 h-4 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 border-2 border-[#1a1a2e]" />

                                <div className="flex-1 glass-card-dark p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold">Day {day.dayNumber}</span>
                                            <span className="text-sm text-white/50">{day.city}</span>
                                        </div>
                                        <span className={getFeasibilityLabel(day.feasibility).class}>
                                            {getFeasibilityLabel(day.feasibility).text}
                                        </span>
                                    </div>

                                    <p className="text-sm text-white/60 mb-3">{formatDate(day.date, 'long')}</p>

                                    <div className="flex flex-wrap gap-2">
                                        {day.activities?.slice(0, 4).map(activity => (
                                            <span
                                                key={activity.id}
                                                className="px-2 py-1 rounded-lg text-xs"
                                                style={{
                                                    backgroundColor: getActivityColor(activity.type) + '20',
                                                    color: getActivityColor(activity.type)
                                                }}
                                            >
                                                {getActivityIcon(activity.type)} {activity.name}
                                            </span>
                                        ))}
                                        {day.activities && day.activities.length > 4 && (
                                            <span className="px-2 py-1 rounded-lg text-xs bg-white/10 text-white/50">
                                                +{day.activities.length - 4} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default TripCalendar
