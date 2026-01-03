import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import {
    MapPin, Calendar, Clock, Wallet, Plus, GripVertical, Trash2,
    ChevronRight, ChevronDown, Edit2, Save, X, Sparkles, AlertTriangle,
    CheckCircle, XCircle, ArrowLeft, Eye, Share2, Settings, MoreVertical
} from 'lucide-react'
import { useTrip } from '../context/TripContext'
import { aiService } from '../services/aiService'
import { formatCurrency, formatDate, getActivityIcon, getActivityColor, getFeasibilityLabel } from '../utils/tripUtils'
import toast from 'react-hot-toast'

const ItineraryBuilder = () => {
    const { tripId } = useParams()
    const navigate = useNavigate()
    const {
        getTrip, updateTrip, addCity, removeCity, reorderCities,
        addDay, addActivity, updateActivity, removeActivity, moveActivity
    } = useTrip()

    const [trip, setTrip] = useState(null)
    const [expandedCities, setExpandedCities] = useState({})
    const [expandedDays, setExpandedDays] = useState({})
    const [editingActivity, setEditingActivity] = useState(null)
    const [showAddActivity, setShowAddActivity] = useState(null)
    const [aiLoading, setAiLoading] = useState(false)
    const [aiSuggestions, setAiSuggestions] = useState([])

    useEffect(() => {
        const tripData = getTrip(tripId)
        if (tripData) {
            setTrip(tripData)
            // Expand all cities by default
            const expanded = {}
            tripData.cities?.forEach(city => {
                expanded[city.id] = true
                city.days?.forEach(day => {
                    expandedDays[day.id] = true
                })
            })
            setExpandedCities(expanded)
        }
    }, [tripId, getTrip])

    const handleDragEnd = async (result) => {
        if (!result.destination) return

        const { source, destination, type } = result

        if (type === 'city') {
            await reorderCities(tripId, source.index, destination.index)
            toast.success('Cities reordered')
        } else if (type === 'activity') {
            const [sourceCityId, sourceDayId] = source.droppableId.split('-')
            const [destCityId, destDayId] = destination.droppableId.split('-')

            await moveActivity(
                tripId,
                sourceCityId,
                sourceDayId,
                destCityId,
                destDayId,
                result.draggableId,
                destination.index
            )
            toast.success('Activity moved')
        }

        // Refresh trip data
        setTrip(getTrip(tripId))
    }

    const handleAddDay = async (cityId) => {
        const city = trip.cities.find(c => c.id === cityId)
        const nextDayNumber = (city.days?.length || 0) + 1
        await addDay(tripId, cityId, {
            date: new Date(new Date(trip.startDate).getTime() + (nextDayNumber - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })
        setTrip(getTrip(tripId))
        toast.success('Day added')
    }

    const handleAddActivity = async (cityId, dayId, activityData) => {
        await addActivity(tripId, cityId, dayId, activityData)
        setTrip(getTrip(tripId))
        setShowAddActivity(null)
        toast.success('Activity added')
    }

    const handleUpdateActivity = async (cityId, dayId, activityId, updates) => {
        await updateActivity(tripId, cityId, dayId, activityId, updates)
        setTrip(getTrip(tripId))
        setEditingActivity(null)
        toast.success('Activity updated')
    }

    const handleRemoveActivity = async (cityId, dayId, activityId) => {
        await removeActivity(tripId, cityId, dayId, activityId)
        setTrip(getTrip(tripId))
        toast.success('Activity removed')
    }

    const handleRemoveCity = async (cityId) => {
        if (confirm('Remove this city and all its activities?')) {
            await removeCity(tripId, cityId)
            setTrip(getTrip(tripId))
            toast.success('City removed')
        }
    }

    const getAiSuggestions = async (cityId) => {
        const city = trip.cities.find(c => c.id === cityId)
        setAiLoading(true)
        try {
            const suggestions = await aiService.getActivitySuggestions(city, { tripType: trip.tripType })
            setAiSuggestions(suggestions)
        } catch (error) {
            toast.error('Failed to get AI suggestions')
        }
        setAiLoading(false)
    }

    const getFeasibilityIcon = (feasibility) => {
        switch (feasibility) {
            case 'smooth': return <CheckCircle className="w-4 h-4 text-green-400" />
            case 'tight': return <AlertTriangle className="w-4 h-4 text-yellow-400" />
            case 'overloaded': return <XCircle className="w-4 h-4 text-red-400" />
            default: return null
        }
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl mx-auto"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate('/app/my-trips')}
                        className="p-2 rounded-lg hover:bg-white/10"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </motion.button>
                    <div>
                        <h1 className="heading-md">{trip.name}</h1>
                        <p className="text-white/60 text-sm">
                            {formatDate(trip.startDate, 'long')} - {formatDate(trip.endDate, 'long')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Link to={`/app/trip/${tripId}/cities`}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add City
                        </motion.button>
                    </Link>
                    <Link to={`/app/trip/${tripId}/view`}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <Eye className="w-4 h-4" />
                            Preview
                        </motion.button>
                    </Link>
                    <Link to={`/app/trip/${tripId}/budget`}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Wallet className="w-4 h-4" />
                            Budget
                        </motion.button>
                    </Link>
                </div>
            </div>

            {/* No cities message */}
            {(!trip.cities || trip.cities.length === 0) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-12 text-center"
                >
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-10 h-10 text-primary-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No cities added yet</h3>
                    <p className="text-white/60 mb-6">Start by adding your first destination</p>
                    <Link to={`/app/trip/${tripId}/cities`}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary"
                        >
                            Add Your First City
                        </motion.button>
                    </Link>
                </motion.div>
            )}

            {/* Cities & Days */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="cities" type="city">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                            {trip.cities?.map((city, cityIndex) => (
                                <Draggable key={city.id} draggableId={city.id} index={cityIndex}>
                                    {(provided, snapshot) => (
                                        <motion.div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: cityIndex * 0.1 }}
                                            className={`glass-card overflow-hidden ${snapshot.isDragging ? 'shadow-glow' : ''}`}
                                        >
                                            {/* City Header */}
                                            <div className="relative">
                                                <div className="absolute inset-0">
                                                    <img
                                                        src={city.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600'}
                                                        alt={city.name}
                                                        className="w-full h-full object-cover opacity-30"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
                                                </div>

                                                <div className="relative p-6 flex items-center gap-4">
                                                    <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                                                        <GripVertical className="w-6 h-6 text-white/50 hover:text-white" />
                                                    </div>

                                                    <div className="w-16 h-16 rounded-2xl overflow-hidden">
                                                        <img
                                                            src={city.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200'}
                                                            alt={city.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>

                                                    <div className="flex-1">
                                                        <h2 className="text-2xl font-bold flex items-center gap-2">
                                                            {city.name}
                                                            <span className="text-sm font-normal text-white/50">{city.country}</span>
                                                        </h2>
                                                        <div className="flex items-center gap-4 text-sm text-white/60 mt-1">
                                                            <span>{city.days?.length || 0} days</span>
                                                            <span>{city.days?.reduce((sum, d) => sum + (d.activities?.length || 0), 0) || 0} activities</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => getAiSuggestions(city.id)}
                                                            className="p-2 rounded-lg bg-accent-500/20 hover:bg-accent-500/30 text-accent-400"
                                                        >
                                                            <Sparkles className="w-5 h-5" />
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleRemoveCity(city.id)}
                                                            className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => setExpandedCities({
                                                                ...expandedCities,
                                                                [city.id]: !expandedCities[city.id]
                                                            })}
                                                            className="p-2 rounded-lg hover:bg-white/10"
                                                        >
                                                            {expandedCities[city.id] ? (
                                                                <ChevronDown className="w-5 h-5" />
                                                            ) : (
                                                                <ChevronRight className="w-5 h-5" />
                                                            )}
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Days */}
                                            <AnimatePresence>
                                                {expandedCities[city.id] && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="p-6 pt-0 space-y-4"
                                                    >
                                                        {city.days?.map((day, dayIndex) => (
                                                            <motion.div
                                                                key={day.id}
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: dayIndex * 0.05 }}
                                                                className="glass-card-dark p-4"
                                                            >
                                                                {/* Day Header */}
                                                                <div className="flex items-center justify-between mb-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center font-bold">
                                                                            {day.dayNumber}
                                                                        </div>
                                                                        <div>
                                                                            <h3 className="font-semibold">Day {day.dayNumber}</h3>
                                                                            <p className="text-sm text-white/50">{formatDate(day.date, 'long')}</p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center gap-2">
                                                                        <span className={getFeasibilityLabel(day.feasibility).class}>
                                                                            {getFeasibilityLabel(day.feasibility).text}
                                                                        </span>
                                                                        <motion.button
                                                                            whileHover={{ scale: 1.1 }}
                                                                            whileTap={{ scale: 0.9 }}
                                                                            onClick={() => setExpandedDays({
                                                                                ...expandedDays,
                                                                                [day.id]: !expandedDays[day.id]
                                                                            })}
                                                                            className="p-1 rounded hover:bg-white/10"
                                                                        >
                                                                            {expandedDays[day.id] !== false ? (
                                                                                <ChevronDown className="w-4 h-4" />
                                                                            ) : (
                                                                                <ChevronRight className="w-4 h-4" />
                                                                            )}
                                                                        </motion.button>
                                                                    </div>
                                                                </div>

                                                                {/* Activities */}
                                                                <AnimatePresence>
                                                                    {expandedDays[day.id] !== false && (
                                                                        <Droppable droppableId={`${city.id}-${day.id}`} type="activity">
                                                                            {(provided, snapshot) => (
                                                                                <motion.div
                                                                                    initial={{ opacity: 0 }}
                                                                                    animate={{ opacity: 1 }}
                                                                                    exit={{ opacity: 0 }}
                                                                                    ref={provided.innerRef}
                                                                                    {...provided.droppableProps}
                                                                                    className={`space-y-2 min-h-[50px] p-2 rounded-xl transition-colors ${snapshot.isDraggingOver ? 'bg-primary-500/10' : ''
                                                                                        }`}
                                                                                >
                                                                                    {day.activities?.map((activity, actIndex) => (
                                                                                        <Draggable key={activity.id} draggableId={activity.id} index={actIndex}>
                                                                                            {(provided, snapshot) => (
                                                                                                <motion.div
                                                                                                    ref={provided.innerRef}
                                                                                                    {...provided.draggableProps}
                                                                                                    whileHover={{ scale: 1.01 }}
                                                                                                    className={`flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 ${snapshot.isDragging ? 'shadow-lg' : ''
                                                                                                        }`}
                                                                                                >
                                                                                                    <div {...provided.dragHandleProps}>
                                                                                                        <GripVertical className="w-4 h-4 text-white/30 cursor-grab" />
                                                                                                    </div>

                                                                                                    <div
                                                                                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                                                                                                        style={{ backgroundColor: getActivityColor(activity.type) + '20' }}
                                                                                                    >
                                                                                                        {getActivityIcon(activity.type)}
                                                                                                    </div>

                                                                                                    <div className="flex-1 min-w-0">
                                                                                                        <h4 className="font-medium truncate">{activity.name}</h4>
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

                                                                                                    <div className="flex items-center gap-1">
                                                                                                        <button
                                                                                                            onClick={() => setEditingActivity({
                                                                                                                ...activity,
                                                                                                                cityId: city.id,
                                                                                                                dayId: day.id
                                                                                                            })}
                                                                                                            className="p-1.5 rounded-lg hover:bg-white/10"
                                                                                                        >
                                                                                                            <Edit2 className="w-4 h-4 text-white/50" />
                                                                                                        </button>
                                                                                                        <button
                                                                                                            onClick={() => handleRemoveActivity(city.id, day.id, activity.id)}
                                                                                                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400"
                                                                                                        >
                                                                                                            <Trash2 className="w-4 h-4" />
                                                                                                        </button>
                                                                                                    </div>
                                                                                                </motion.div>
                                                                                            )}
                                                                                        </Draggable>
                                                                                    ))}
                                                                                    {provided.placeholder}

                                                                                    {/* Add Activity Button */}
                                                                                    <motion.button
                                                                                        whileHover={{ scale: 1.02 }}
                                                                                        whileTap={{ scale: 0.98 }}
                                                                                        onClick={() => setShowAddActivity({ cityId: city.id, dayId: day.id })}
                                                                                        className="w-full p-3 rounded-xl border-2 border-dashed border-white/10 hover:border-primary-500/50 text-white/50 hover:text-white flex items-center justify-center gap-2 transition-all"
                                                                                    >
                                                                                        <Plus className="w-4 h-4" />
                                                                                        Add Activity
                                                                                    </motion.button>
                                                                                </motion.div>
                                                                            )}
                                                                        </Droppable>
                                                                    )}
                                                                </AnimatePresence>
                                                            </motion.div>
                                                        ))}

                                                        {/* Add Day Button */}
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => handleAddDay(city.id)}
                                                            className="w-full p-4 rounded-xl border-2 border-dashed border-white/10 hover:border-primary-500/50 text-white/50 hover:text-white flex items-center justify-center gap-2 transition-all"
                                                        >
                                                            <Plus className="w-5 h-5" />
                                                            Add New Day
                                                        </motion.button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {/* Add Activity Modal */}
            <AnimatePresence>
                {showAddActivity && (
                    <AddActivityModal
                        onClose={() => setShowAddActivity(null)}
                        onAdd={(data) => handleAddActivity(showAddActivity.cityId, showAddActivity.dayId, data)}
                        aiSuggestions={aiSuggestions}
                    />
                )}
            </AnimatePresence>

            {/* Edit Activity Modal */}
            <AnimatePresence>
                {editingActivity && (
                    <EditActivityModal
                        activity={editingActivity}
                        onClose={() => setEditingActivity(null)}
                        onSave={(updates) => handleUpdateActivity(
                            editingActivity.cityId,
                            editingActivity.dayId,
                            editingActivity.id,
                            updates
                        )}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    )
}

// Add Activity Modal Component
const AddActivityModal = ({ onClose, onAdd, aiSuggestions }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'sightseeing',
        time: '09:00',
        duration: 120,
        cost: 0,
        notes: ''
    })

    const activityTypes = [
        'sightseeing', 'food', 'transport', 'accommodation',
        'shopping', 'entertainment', 'experience', 'wellness', 'adventure'
    ]

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-card p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Add Activity</h2>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* AI Suggestions */}
                {aiSuggestions.length > 0 && (
                    <div className="mb-6">
                        <p className="text-sm text-white/60 mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-accent-400" />
                            AI Suggestions
                        </p>
                        <div className="space-y-2">
                            {aiSuggestions.slice(0, 3).map((suggestion, i) => (
                                <button
                                    key={i}
                                    onClick={() => setFormData({
                                        ...formData,
                                        name: suggestion.name,
                                        type: suggestion.type,
                                        duration: suggestion.duration || 120,
                                        cost: suggestion.estimatedCost || 0
                                    })}
                                    className="w-full text-left p-3 rounded-xl bg-accent-500/10 hover:bg-accent-500/20 transition-colors"
                                >
                                    <div className="font-medium">{suggestion.name}</div>
                                    <div className="text-xs text-white/50">{suggestion.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <form onSubmit={(e) => {
                    e.preventDefault()
                    onAdd(formData)
                }} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Activity Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input-glass"
                            placeholder="e.g., Visit Taj Mahal"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="input-glass"
                            >
                                {activityTypes.map(type => (
                                    <option key={type} value={type}>
                                        {getActivityIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Time</label>
                            <input
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className="input-glass"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Duration (min)</label>
                            <input
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                className="input-glass"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Cost (₹)</label>
                            <input
                                type="number"
                                value={formData.cost}
                                onChange={(e) => setFormData({ ...formData, cost: parseInt(e.target.value) })}
                                className="input-glass"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add Activity
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    )
}

// Edit Activity Modal Component
const EditActivityModal = ({ activity, onClose, onSave }) => {
    const [formData, setFormData] = useState(activity)

    const activityTypes = [
        'sightseeing', 'food', 'transport', 'accommodation',
        'shopping', 'entertainment', 'experience', 'wellness', 'adventure'
    ]

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-card p-6 w-full max-w-md"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Edit Activity</h2>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={(e) => {
                    e.preventDefault()
                    onSave(formData)
                }} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Activity Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input-glass"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="input-glass"
                            >
                                {activityTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Time</label>
                            <input
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className="input-glass"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Duration (min)</label>
                            <input
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                className="input-glass"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Cost (₹)</label>
                            <input
                                type="number"
                                value={formData.cost}
                                onChange={(e) => setFormData({ ...formData, cost: parseInt(e.target.value) })}
                                className="input-glass"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    )
}

export default ItineraryBuilder
