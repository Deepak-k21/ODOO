import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    MapPin, Calendar, Wallet, Plus, Search, Filter, Grid, List,
    MoreVertical, Trash2, Share2, Copy, Eye, Edit, Globe2, Lock
} from 'lucide-react'
import { useTrip } from '../context/TripContext'
import { formatCurrency, formatDate, getTripDuration } from '../utils/tripUtils'
import toast from 'react-hot-toast'

const MyTrips = () => {
    const navigate = useNavigate()
    const { trips, deleteTrip, generateShareLink, copyTrip } = useTrip()
    const [view, setView] = useState('grid')
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [activeMenu, setActiveMenu] = useState(null)

    const filteredTrips = trips.filter(trip => {
        const matchesSearch = trip.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = filterStatus === 'all' || trip.status === filterStatus
        return matchesSearch && matchesStatus
    })

    const handleDelete = async (tripId, e) => {
        e.stopPropagation()
        if (confirm('Are you sure you want to delete this trip?')) {
            await deleteTrip(tripId)
            toast.success('Trip deleted')
        }
        setActiveMenu(null)
    }

    const handleShare = async (tripId, e) => {
        e.stopPropagation()
        const link = await generateShareLink(tripId)
        navigator.clipboard.writeText(link)
        toast.success('Share link copied to clipboard!')
        setActiveMenu(null)
    }

    const handleCopy = async (tripId, e) => {
        e.stopPropagation()
        await copyTrip(tripId)
        toast.success('Trip duplicated!')
        setActiveMenu(null)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="heading-lg mb-2">My Trips</h1>
                    <p className="text-white/60">{trips.length} trips created</p>
                </div>

                <Link to="/app/create-trip">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Trip
                    </motion.button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search trips..."
                        className="input-glass pl-12"
                    />
                </div>

                <div className="flex gap-2">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="input-glass w-40"
                    >
                        <option value="all">All Status</option>
                        <option value="draft">Draft</option>
                        <option value="planned">Planned</option>
                        <option value="completed">Completed</option>
                    </select>

                    <div className="flex rounded-xl overflow-hidden border border-white/10">
                        <button
                            onClick={() => setView('grid')}
                            className={`p-3 transition-colors ${view === 'grid' ? 'bg-white/10' : 'hover:bg-white/5'}`}
                        >
                            <Grid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`p-3 transition-colors ${view === 'list' ? 'bg-white/10' : 'hover:bg-white/5'}`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Trips */}
            {filteredTrips.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-12 text-center"
                >
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-10 h-10 text-primary-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No trips found</h3>
                    <p className="text-white/60 mb-6">
                        {searchQuery ? 'Try a different search term' : 'Start planning your first adventure!'}
                    </p>
                    <Link to="/app/create-trip">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary"
                        >
                            Create Your First Trip
                        </motion.button>
                    </Link>
                </motion.div>
            ) : view === 'grid' ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTrips.map((trip, index) => (
                        <motion.div
                            key={trip.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            onClick={() => navigate(`/app/trip/${trip.id}/builder`)}
                            className="glass-card overflow-hidden cursor-pointer group relative"
                        >
                            {/* Cover Image */}
                            <div className="relative h-48">
                                <img
                                    src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600'}
                                    alt={trip.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Status Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${trip.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                            trip.status === 'planned' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-white/20 text-white/70'
                                        }`}>
                                        {trip.status || 'Draft'}
                                    </span>
                                </div>

                                {/* Public/Private */}
                                <div className="absolute top-4 right-4">
                                    {trip.isPublic ? (
                                        <Globe2 className="w-5 h-5 text-green-400" />
                                    ) : (
                                        <Lock className="w-5 h-5 text-white/50" />
                                    )}
                                </div>

                                {/* Title */}
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="font-bold text-lg mb-1 line-clamp-1">{trip.name}</h3>
                                    <div className="flex items-center gap-3 text-sm text-white/70">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {trip.cities?.length || 0} cities
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {getTripDuration(trip.startDate, trip.endDate)} days
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <p className="text-sm text-white/60 mb-4 line-clamp-2">
                                    {trip.description || 'No description'}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Wallet className="w-4 h-4 text-accent-400" />
                                        <span className="font-medium">{formatCurrency(trip.totalBudget || 0)}</span>
                                    </div>
                                    <span className="text-sm text-white/50">{formatDate(trip.startDate)}</span>
                                </div>

                                {/* Feasibility Bars */}
                                <div className="flex gap-1 mt-3">
                                    {trip.cities?.flatMap(city => city.days || []).slice(0, 10).map((day, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ scaleY: 0 }}
                                            animate={{ scaleY: 1 }}
                                            transition={{ delay: 0.3 + i * 0.05 }}
                                            className={`h-1.5 flex-1 rounded-full ${day.feasibility === 'smooth' ? 'bg-green-500' :
                                                    day.feasibility === 'tight' ? 'bg-yellow-500' : 'bg-red-500'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Menu */}
                            <div className="absolute top-12 right-4">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setActiveMenu(activeMenu === trip.id ? null : trip.id)
                                    }}
                                    className="p-2 rounded-lg bg-black/50 hover:bg-black/70 transition-colors"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </button>

                                <AnimatePresence>
                                    {activeMenu === trip.id && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="absolute right-0 top-10 w-48 glass-card p-2 z-10"
                                        >
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    navigate(`/app/trip/${trip.id}/view`)
                                                    setActiveMenu(null)
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-left"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    navigate(`/app/trip/${trip.id}/builder`)
                                                    setActiveMenu(null)
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-left"
                                            >
                                                <Edit className="w-4 h-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={(e) => handleShare(trip.id, e)}
                                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-left"
                                            >
                                                <Share2 className="w-4 h-4" />
                                                Share
                                            </button>
                                            <button
                                                onClick={(e) => handleCopy(trip.id, e)}
                                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-left"
                                            >
                                                <Copy className="w-4 h-4" />
                                                Duplicate
                                            </button>
                                            <hr className="my-2 border-white/10" />
                                            <button
                                                onClick={(e) => handleDelete(trip.id, e)}
                                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-400 text-left"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredTrips.map((trip, index) => (
                        <motion.div
                            key={trip.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => navigate(`/app/trip/${trip.id}/builder`)}
                            className="glass-card p-4 flex items-center gap-4 cursor-pointer hover:border-white/20 transition-colors"
                        >
                            <img
                                src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200'}
                                alt={trip.name}
                                className="w-20 h-20 rounded-xl object-cover"
                            />

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-lg truncate">{trip.name}</h3>
                                    {trip.isPublic && <Globe2 className="w-4 h-4 text-green-400" />}
                                </div>
                                <p className="text-sm text-white/60 truncate">{trip.description || 'No description'}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-white/50">
                                    <span>{trip.cities?.length || 0} cities</span>
                                    <span>{getTripDuration(trip.startDate, trip.endDate)} days</span>
                                    <span>{formatDate(trip.startDate)}</span>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="font-bold text-lg">{formatCurrency(trip.totalBudget || 0)}</div>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${trip.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                        trip.status === 'planned' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-white/20 text-white/70'
                                    }`}>
                                    {trip.status || 'Draft'}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    )
}

export default MyTrips
