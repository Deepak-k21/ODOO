import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Search, ArrowLeft, Plus, Star, Clock, Wallet } from 'lucide-react'
import { useTrip } from '../context/TripContext'
import toast from 'react-hot-toast'

const POPULAR_CITIES = [
    { name: 'New Delhi', country: 'India', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600', rating: 4.5 },
    { name: 'Agra', country: 'India', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600', rating: 4.8 },
    { name: 'Jaipur', country: 'India', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600', rating: 4.7 },
    { name: 'Mumbai', country: 'India', image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600', rating: 4.4 },
    { name: 'Goa', country: 'India', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', rating: 4.6 },
    { name: 'Kerala', country: 'India', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600', rating: 4.7 },
    { name: 'Varanasi', country: 'India', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600', rating: 4.5 },
    { name: 'Udaipur', country: 'India', image: 'https://images.unsplash.com/photo-1588083949404-c4f1ed1323b3?w=600', rating: 4.8 },
    { name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600', rating: 4.9 },
    { name: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600', rating: 4.8 },
    { name: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', rating: 4.7 },
    { name: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600', rating: 4.6 },
]

const CitySearch = () => {
    const { tripId } = useParams()
    const navigate = useNavigate()
    const { getTrip, addCity } = useTrip()

    const [trip, setTrip] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCities, setSelectedCities] = useState([])

    useEffect(() => {
        const tripData = getTrip(tripId)
        setTrip(tripData)
        // Pre-select already added cities
        if (tripData?.cities) {
            setSelectedCities(tripData.cities.map(c => c.name))
        }
    }, [tripId, getTrip])

    const filteredCities = POPULAR_CITIES.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.country.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAddCity = async (city) => {
        if (selectedCities.includes(city.name)) {
            toast.error('City already added')
            return
        }

        await addCity(tripId, {
            name: city.name,
            country: city.country,
            image: city.image,
            rating: city.rating
        })

        setSelectedCities([...selectedCities, city.name])
        toast.success(`${city.name} added to your trip!`)
    }

    const handleContinue = () => {
        navigate(`/app/trip/${tripId}/builder`)
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
                        onClick={() => navigate('/app/my-trips')}
                        className="p-2 rounded-lg hover:bg-white/10"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </motion.button>
                    <div>
                        <h1 className="heading-md">Add Cities</h1>
                        <p className="text-white/60">Select destinations for {trip.name}</p>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleContinue}
                    disabled={selectedCities.length === 0}
                    className={`btn-primary flex items-center gap-2 ${selectedCities.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Continue to Itinerary
                </motion.button>
            </div>

            {/* Search */}
            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cities..."
                    className="input-glass pl-12 w-full"
                />
            </div>

            {/* Selected Cities */}
            {selectedCities.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-8"
                >
                    <h3 className="text-sm text-white/50 mb-3">Selected Cities ({selectedCities.length})</h3>
                    <div className="flex flex-wrap gap-2">
                        {selectedCities.map(city => (
                            <motion.span
                                key={city}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/50"
                            >
                                <MapPin className="w-4 h-4 inline mr-1" />
                                {city}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* City Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCities.map((city, index) => {
                    const isSelected = selectedCities.includes(city.name)

                    return (
                        <motion.div
                            key={city.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -5 }}
                            className={`glass-card overflow-hidden cursor-pointer group ${isSelected ? 'ring-2 ring-primary-500' : ''
                                }`}
                            onClick={() => !isSelected && handleAddCity(city)}
                        >
                            <div className="relative h-48">
                                <img
                                    src={city.image}
                                    alt={city.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {isSelected && (
                                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                                        <Plus className="w-5 h-5 rotate-45" />
                                    </div>
                                )}

                                <div className="absolute bottom-4 left-4">
                                    <h3 className="text-xl font-bold">{city.name}</h3>
                                    <p className="text-sm text-white/70">{city.country}</p>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-accent-400 text-accent-400" />
                                        <span className="font-medium">{city.rating}</span>
                                    </div>

                                    {!isSelected && (
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="flex items-center gap-1 text-primary-400 hover:text-primary-300"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {filteredCities.length === 0 && (
                <div className="text-center py-12">
                    <MapPin className="w-12 h-12 mx-auto mb-4 text-white/20" />
                    <p className="text-white/50">No cities found for "{searchQuery}"</p>
                </div>
            )}
        </motion.div>
    )
}

export default CitySearch
