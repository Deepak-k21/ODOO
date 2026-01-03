import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Globe2, Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const SignupPage = () => {
    const navigate = useNavigate()
    const { signup, demoLogin } = useAuth()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const passwordStrength = () => {
        if (password.length === 0) return 0
        let strength = 0
        if (password.length >= 8) strength++
        if (/[A-Z]/.test(password)) strength++
        if (/[0-9]/.test(password)) strength++
        if (/[^A-Za-z0-9]/.test(password)) strength++
        return strength
    }

    const strength = passwordStrength()
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500']
    const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong']

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        const result = await signup(name, email, password)

        if (result.success) {
            toast.success('Account created successfully!')
            navigate('/app/dashboard')
        } else {
            toast.error(result.error)
        }

        setLoading(false)
    }

    const handleDemoLogin = async () => {
        setLoading(true)
        await demoLogin()
        toast.success('Welcome to demo mode!')
        navigate('/app/dashboard')
    }

    const features = [
        'AI-powered trip planning',
        'Feasibility analysis',
        'Budget tracking',
        'Share & collaborate'
    ]

    return (
        <div className="min-h-screen flex relative overflow-hidden">
            {/* Left Panel - Features */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:flex flex-1 items-center justify-center p-12 relative"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10" />
                <motion.div
                    animate={{
                        rotate: [0, 360],
                    }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 border border-white/5 rounded-full"
                />
                <motion.div
                    animate={{
                        rotate: [360, 0],
                    }}
                    transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/3 left-1/3 w-64 h-64 border border-white/5 rounded-full"
                />

                <div className="relative z-10 max-w-md">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                            <Globe2 className="w-9 h-9 text-white" />
                        </div>
                        <span className="text-3xl font-bold gradient-text">GlobeTrotter</span>
                    </div>

                    <h2 className="heading-lg mb-4">Start Your Travel Design Journey</h2>
                    <p className="text-white/60 mb-8 text-lg">
                        Join thousands of travelers who plan smarter trips with AI-powered insights.
                    </p>

                    <div className="space-y-4">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="flex items-center gap-3"
                            >
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-white/80">{feature}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-8 lg:hidden">
                        <Link to="/" className="inline-flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                                <Globe2 className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-2xl font-bold gradient-text">GlobeTrotter</span>
                        </Link>
                    </div>

                    <div className="text-center lg:text-left mb-8">
                        <h1 className="heading-md mb-2">Create Account</h1>
                        <p className="text-white/60">Get started with your free account</p>
                    </div>

                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        onSubmit={handleSubmit}
                        className="glass-card p-8 space-y-5"
                    >
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-primary-400">
                                    <User className="w-5 h-5 text-white/30" />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="input-glass input-with-icon"
                                    required
                                />
                            </div>
                        </div>


                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-primary-400">
                                    <Mail className="w-5 h-5 text-white/30" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="input-glass input-with-icon"
                                    required
                                />

                            </div>
                        </div>


                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-primary-400">
                                    <Lock className="w-5 h-5 text-white/30" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="input-glass input-with-icon"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors border-none bg-transparent cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {password.length > 0 && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[...Array(4)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-all ${i < strength ? strengthColors[strength - 1] : 'bg-white/10'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-white/50">
                                        {strength > 0 ? strengthLabels[strength - 1] : 'Enter password'}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Confirm Password</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-primary-400">
                                    <Lock className="w-5 h-5 text-white/30" />
                                </div>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="input-glass input-with-icon"
                                    required
                                />

                                {confirmPassword && password === confirmPassword && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    </div>
                                )}
                            </div>
                        </div>


                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="spinner w-5 h-5" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </motion.button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-[#1a1a2e] text-white/50">or</span>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={handleDemoLogin}
                            className="btn-secondary w-full"
                        >
                            Skip to Demo
                        </motion.button>
                    </motion.form>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-center mt-6 text-white/60"
                    >
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
                            Sign in
                        </Link>
                    </motion.p>
                </motion.div>
            </div>
        </div>
    )
}

export default SignupPage
