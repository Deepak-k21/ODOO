import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
    Globe2, Plane, MapPin, Calendar, Wallet, Users, ArrowRight,
    Star, CheckCircle2, Sparkles, ChevronDown, Play, Zap, Shield,
    TrendingUp, Clock, Heart
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const LandingPage = () => {
    const navigate = useNavigate()
    const { demoLogin, isAuthenticated } = useAuth()
    const [activeFeature, setActiveFeature] = useState(0)
    const { scrollY } = useScroll()

    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
    const heroScale = useTransform(scrollY, [0, 400], [1, 0.8])

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/app/dashboard')
        }
    }, [isAuthenticated, navigate])

    const handleDemoLogin = async () => {
        await demoLogin()
        navigate('/app/dashboard')
    }

    const features = [
        {
            icon: Zap,
            title: 'Trip Feasibility Engine',
            description: 'AI-powered analysis of your itinerary that labels days as Smooth ✅, Tight ⚠️, or Overloaded ❌',
            image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600'
        },
        {
            icon: Wallet,
            title: 'Living Budget System',
            description: 'See cost per city, per day, per activity. Know exactly why a day is expensive.',
            image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600'
        },
        {
            icon: MapPin,
            title: 'Drag-Driven Planning',
            description: 'Drag cities and activities with instant recalculation of dates, budget, and feasibility.',
            image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600'
        },
        {
            icon: Sparkles,
            title: 'AI Assistant',
            description: 'Gemini AI suggests activities, generates summaries, packing lists, and travel tips.',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600'
        }
    ]

    const destinations = [
        { name: 'Jaipur', country: 'India', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400' },
        { name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400' },
        { name: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400' },
        { name: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400' },
        { name: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400' },
        { name: 'New York', country: 'USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400' },
    ]

    const stats = [
        { value: '50K+', label: 'Trips Planned' },
        { value: '120+', label: 'Countries' },
        { value: '4.9', label: 'User Rating' },
        { value: '24/7', label: 'AI Support' },
    ]

    const testimonials = [
        {
            name: 'Priya Sharma',
            role: 'Travel Blogger',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
            text: 'GlobeTrotter completely changed how I plan trips. The feasibility engine saved me from creating exhausting itineraries!'
        },
        {
            name: 'Rahul Mehta',
            role: 'Business Traveler',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            text: 'The budget breakdown feature is incredible. I finally know exactly where my money goes on every trip.'
        },
        {
            name: 'Sarah Chen',
            role: 'Adventure Enthusiast',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
            text: 'Drag and drop planning is so intuitive! I can reorganize my entire trip in seconds.'
        }
    ]

    return (
        <div className="min-h-screen overflow-hidden">
            {/* Navigation */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/30"
                        >
                            <Globe2 className="w-7 h-7 text-white" />
                        </motion.div>
                        <span className="text-2xl font-bold gradient-text">GlobeTrotter</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-white/70 hover:text-white transition-colors">Features</a>
                        <a href="#destinations" className="text-white/70 hover:text-white transition-colors">Destinations</a>
                        <a href="#testimonials" className="text-white/70 hover:text-white transition-colors">Reviews</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-secondary hidden sm:block"
                            >
                                Login
                            </motion.button>
                        </Link>
                        <Link to="/signup">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-primary"
                            >
                                Start Free
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <motion.section
                style={{ opacity: heroOpacity, scale: heroScale }}
                className="relative min-h-screen flex items-center justify-center pt-24 pb-20 px-6"
            >
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{
                            x: [0, 100, 0],
                            y: [0, -50, 0],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            x: [0, -80, 0],
                            y: [0, 80, 0],
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            x: [0, 50, 0],
                            y: [0, 100, 0],
                        }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl"
                    />
                </div>

                {/* Floating Planes */}
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        style={{
                            top: `${20 + i * 15}%`,
                            left: `${10 + i * 20}%`,
                        }}
                        animate={{
                            x: [0, 100, 200],
                            y: [0, -30, 0],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                            duration: 10 + i * 2,
                            repeat: Infinity,
                            delay: i * 2
                        }}
                    >
                        <Plane className="w-6 h-6 text-white/20 transform rotate-45" />
                    </motion.div>
                ))}

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mb-6"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
                            <Sparkles className="w-4 h-4 text-accent-400" />
                            <span className="text-white/70">AI-Powered Travel Planning</span>
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="heading-xl mb-6 text-balance"
                    >
                        Design Your Perfect
                        <br />
                        <span className="gradient-text">Travel Experience</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-xl text-white/60 max-w-2xl mx-auto mb-10 text-balance"
                    >
                        Not just a planner — a travel design tool that tells you if your trip is
                        <span className="text-success-500"> realistic</span>, where your
                        <span className="text-accent-400"> money goes</span>, and if your journey is
                        <span className="text-primary-400"> smooth or exhausting</span>.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                    >
                        <Link to="/signup">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 45, 94, 0.4)' }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-primary text-lg px-8 py-4 flex items-center gap-2"
                            >
                                Start Planning Free
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </Link>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleDemoLogin}
                            className="btn-secondary text-lg px-8 py-4 flex items-center gap-2"
                        >
                            <Play className="w-5 h-5" />
                            Try Demo
                        </motion.button>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.2 + index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                                <div className="text-sm text-white/50">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <ChevronDown className="w-8 h-8 text-white/30" />
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* Features Section */}
            <section id="features" className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="heading-lg mb-4">What Makes Us <span className="gradient-text">Different</span></h2>
                        <p className="text-xl text-white/60 max-w-2xl mx-auto">
                            GlobeTrotter answers the questions other planners ignore
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Feature List */}
                        <div className="space-y-4">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    onClick={() => setActiveFeature(index)}
                                    className={`glass-card p-6 cursor-pointer transition-all duration-300 ${activeFeature === index
                                            ? 'border-primary-500/50 shadow-glow'
                                            : 'hover:border-white/20'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${activeFeature === index
                                                ? 'bg-gradient-to-br from-primary-500 to-secondary-500'
                                                : 'bg-white/10'
                                            }`}>
                                            <feature.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                            <p className="text-white/60 text-sm">{feature.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Feature Preview */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="glass-card p-4 relative overflow-hidden rounded-3xl">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={activeFeature}
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.5 }}
                                        src={features[activeFeature].image}
                                        alt={features[activeFeature].title}
                                        className="w-full h-80 object-cover rounded-2xl"
                                    />
                                </AnimatePresence>

                                {/* Overlay Info */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute bottom-8 left-8 right-8 glass-card p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        {(() => {
                                            const Icon = features[activeFeature].icon
                                            return <Icon className="w-5 h-5 text-primary-400" />
                                        })()}
                                        <span className="font-semibold">{features[activeFeature].title}</span>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary-500/30 to-transparent rounded-full blur-2xl" />
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-secondary-500/30 to-transparent rounded-full blur-2xl" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Destinations Section */}
            <section id="destinations" className="py-24 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="heading-lg mb-4">Popular <span className="gradient-text">Destinations</span></h2>
                        <p className="text-xl text-white/60">Explore dream destinations planned by our community</p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {destinations.map((dest, index) => (
                            <motion.div
                                key={dest.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer"
                            >
                                <img
                                    src={dest.image}
                                    alt={dest.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="font-bold text-lg">{dest.name}</h3>
                                    <p className="text-sm text-white/60">{dest.country}</p>
                                </div>
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <motion.div
                                        whileHover={{ scale: 1.2 }}
                                        className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                                    >
                                        <Heart className="w-4 h-4" />
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="heading-lg mb-4">Loved by <span className="gradient-text">Travelers</span></h2>
                        <p className="text-xl text-white/60">See what our community says about GlobeTrotter</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="glass-card p-6"
                            >
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-accent-400 text-accent-400" />
                                    ))}
                                </div>
                                <p className="text-white/70 mb-6 leading-relaxed">"{testimonial.text}"</p>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-primary-500/50"
                                    />
                                    <div>
                                        <div className="font-semibold">{testimonial.name}</div>
                                        <div className="text-sm text-white/50">{testimonial.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto glass-card p-12 md:p-16 text-center relative overflow-hidden"
                >
                    {/* Background Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />

                    <div className="relative z-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, type: 'spring' }}
                            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-8"
                        >
                            <Plane className="w-10 h-10 text-white" />
                        </motion.div>

                        <h2 className="heading-lg mb-4">Ready to Plan Your <span className="gradient-text">Dream Trip</span>?</h2>
                        <p className="text-xl text-white/60 mb-8 max-w-xl mx-auto">
                            Join thousands of travelers who plan smarter, not harder.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/signup">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-primary text-lg px-10 py-4"
                                >
                                    Get Started Free
                                </motion.button>
                            </Link>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleDemoLogin}
                                className="btn-secondary text-lg px-10 py-4"
                            >
                                Explore Demo
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                            <Globe2 className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-lg gradient-text">GlobeTrotter</span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-white/50">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>

                    <p className="text-sm text-white/30">
                        © 2026 GlobeTrotter. Made with ❤️ for travelers.
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage
