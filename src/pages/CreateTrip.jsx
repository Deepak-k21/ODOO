import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    MapPin, Calendar, Users, Wallet, Plane, ArrowRight, ArrowLeft,
    Sparkles, Globe2, CheckCircle, Camera
} from 'lucide-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useTrip } from '../context/TripContext'
import toast from 'react-hot-toast'

const CreateTrip = () => {
    const navigate = useNavigate()
    const { createTrip } = useTrip()
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        travelerCount: 2,
        totalBudget: 50000,
        currency: 'INR',
        tripType: 'leisure',
        coverImage: ''
    })
    const [loading, setLoading] = useState(false)

    const tripTypes = [
        { id: 'leisure', label: 'Leisure', icon: '🏖️', desc: 'Relaxation & sightseeing' },
        { id: 'adventure', label: 'Adventure', icon: '🏔️', desc: 'Thrilling activities' },
        { id: 'cultural', label: 'Cultural', icon: '🏛️', desc: 'Heritage & history' },
        { id: 'romantic', label: 'Romantic', icon: '💕', desc: 'Couples getaway' },
        { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', desc: 'Fun for all ages' },
        { id: 'business', label: 'Business', icon: '💼', desc: 'Work & travel' },
    ]

    const coverImages = [
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
        'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
    ]

    const handleSubmit = async () => {
        if (!formData.name) {
            toast.error('Please enter a trip name')
            return
        }

        setLoading(true)
        const trip = await createTrip({
            ...formData,
            startDate: formData.startDate.toISOString().split('T')[0],
            endDate: formData.endDate.toISOString().split('T')[0],
            coverImage: formData.coverImage || coverImages[Math.floor(Math.random() * coverImages.length)]
        })

        toast.success('Trip created successfully!')
        navigate(`/app/trip/${trip.id}/cities`)
        setLoading(false)
    }

    const steps = [
        { num: 1, label: 'Basic Info' },
        { num: 2, label: 'Trip Type' },
        { num: 3, label: 'Details' },
        { num: 4, label: 'Cover' },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
        >
            {/* Header */}
            <div className="text-center mb-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30"
                >
                    <Plane className="w-10 h-10 text-white" />
                </motion.div>
                <h1 className="heading-lg mb-2">Create New Trip</h1>
                <p className="text-white/60">Let's design your perfect travel experience</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 mb-8">
                {steps.map((s, index) => (
                    <div key={s.num} className="flex items-center">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setStep(s.num)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${step >= s.num
                                    ? 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white'
                                    : 'bg-white/10 text-white/50'
                                }`}
                        >
                            {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
                        </motion.div>
                        {index < steps.length - 1 && (
                            <div className={`w-12 h-0.5 mx-1 ${step > s.num ? 'bg-primary-500' : 'bg-white/10'}`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8"
            >
                <AnimatePresence mode="wait">
                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <Globe2 className="w-5 h-5 text-primary-400" />
                                Basic Information
                            </h2>

                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">Trip Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Golden Triangle Adventure"
                                    className="input-glass"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe your dream trip..."
                                    rows={3}
                                    className="input-glass resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
                                        <Calendar className="w-4 h-4 inline mr-1" />
                                        Start Date
                                    </label>
                                    <DatePicker
                                        selected={formData.startDate}
                                        onChange={(date) => setFormData({ ...formData, startDate: date })}
                                        className="input-glass w-full"
                                        dateFormat="MMM dd, yyyy"
                                        minDate={new Date()}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
                                        <Calendar className="w-4 h-4 inline mr-1" />
                                        End Date
                                    </label>
                                    <DatePicker
                                        selected={formData.endDate}
                                        onChange={(date) => setFormData({ ...formData, endDate: date })}
                                        className="input-glass w-full"
                                        dateFormat="MMM dd, yyyy"
                                        minDate={formData.startDate}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Trip Type */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-accent-400" />
                                What kind of trip is this?
                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {tripTypes.map((type) => (
                                    <motion.div
                                        key={type.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setFormData({ ...formData, tripType: type.id })}
                                        className={`p-4 rounded-xl cursor-pointer transition-all ${formData.tripType === type.id
                                                ? 'bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-primary-500/50'
                                                : 'bg-white/5 border border-transparent hover:border-white/10'
                                            }`}
                                    >
                                        <div className="text-3xl mb-2">{type.icon}</div>
                                        <div className="font-medium">{type.label}</div>
                                        <div className="text-xs text-white/50">{type.desc}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Details */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <Users className="w-5 h-5 text-secondary-400" />
                                Trip Details
                            </h2>

                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">
                                    Number of Travelers
                                </label>
                                <div className="flex items-center gap-4">
                                    {[1, 2, 3, 4, '5+'].map((num) => (
                                        <motion.button
                                            key={num}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setFormData({ ...formData, travelerCount: typeof num === 'number' ? num : 5 })}
                                            className={`w-12 h-12 rounded-xl font-medium transition-all ${formData.travelerCount === (typeof num === 'number' ? num : 5)
                                                    ? 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white'
                                                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                                                }`}
                                        >
                                            {num}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">
                                    <Wallet className="w-4 h-4 inline mr-1" />
                                    Total Budget
                                </label>
                                <div className="flex gap-2">
                                    <select
                                        value={formData.currency}
                                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                        className="input-glass w-24"
                                    >
                                        <option value="INR">₹ INR</option>
                                        <option value="USD">$ USD</option>
                                        <option value="EUR">€ EUR</option>
                                    </select>
                                    <input
                                        type="number"
                                        value={formData.totalBudget}
                                        onChange={(e) => setFormData({ ...formData, totalBudget: parseInt(e.target.value) || 0 })}
                                        className="input-glass flex-1"
                                        placeholder="50000"
                                    />
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-accent-500/10 border border-accent-500/20">
                                <div className="flex items-start gap-3">
                                    <Sparkles className="w-5 h-5 text-accent-400 mt-0.5" />
                                    <div>
                                        <div className="font-medium text-accent-400 mb-1">AI Budget Tip</div>
                                        <p className="text-sm text-white/60">
                                            For a {Math.ceil((formData.endDate - formData.startDate) / (1000 * 60 * 60 * 24))} day trip with {formData.travelerCount} travelers,
                                            we recommend a budget of ₹{((formData.endDate - formData.startDate) / (1000 * 60 * 60 * 24) * 5000 * formData.travelerCount).toLocaleString()}
                                            for a comfortable experience.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Cover Image */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <Camera className="w-5 h-5 text-primary-400" />
                                Choose a Cover Image
                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {coverImages.map((img, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setFormData({ ...formData, coverImage: img })}
                                        className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer ${formData.coverImage === img ? 'ring-2 ring-primary-500' : ''
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                        {formData.coverImage === img && (
                                            <div className="absolute inset-0 bg-primary-500/30 flex items-center justify-center">
                                                <CheckCircle className="w-8 h-8 text-white" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Trip Preview */}
                            <div className="mt-8 p-6 rounded-xl bg-white/5 border border-white/10">
                                <h3 className="font-medium mb-4">Trip Preview</h3>
                                <div className="flex items-start gap-4">
                                    <img
                                        src={formData.coverImage || coverImages[0]}
                                        alt=""
                                        className="w-24 h-24 rounded-xl object-cover"
                                    />
                                    <div>
                                        <h4 className="font-bold text-lg">{formData.name || 'Untitled Trip'}</h4>
                                        <p className="text-sm text-white/60 mb-2">{formData.description || 'No description'}</p>
                                        <div className="flex gap-3 text-sm">
                                            <span className="text-white/50">
                                                {formData.startDate.toLocaleDateString()} - {formData.endDate.toLocaleDateString()}
                                            </span>
                                            <span className="text-white/50">•</span>
                                            <span className="text-white/50">{formData.travelerCount} travelers</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStep(step - 1)}
                        disabled={step === 1}
                        className={`btn-secondary flex items-center gap-2 ${step === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </motion.button>

                    {step < 4 ? (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setStep(step + 1)}
                            className="btn-primary flex items-center gap-2"
                        >
                            Next
                            <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                            disabled={loading}
                            className="btn-primary flex items-center gap-2"
                        >
                            {loading ? (
                                <div className="spinner w-5 h-5" />
                            ) : (
                                <>
                                    Create Trip
                                    <Plane className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    )
}

export default CreateTrip
