import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Globe2, Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const LoginPage = () => {
    const navigate = useNavigate()
    const { login, demoLogin } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const result = await login(email, password)

        if (result.success) {
            toast.success('Welcome back!')
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

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-20 left-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 10, repeat: Infinity, delay: 2 }}
                    className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-secondary-500/20 rounded-full blur-3xl"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className="text-center mb-8"
                >
                    <Link to="/" className="inline-flex items-center gap-3 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                            <Globe2 className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-3xl font-bold gradient-text">GlobeTrotter</span>
                    </Link>
                    <h1 className="heading-md mb-2">Welcome Back</h1>
                    <p className="text-white/60">Sign in to continue your travel planning</p>
                </motion.div>

                {/* Login Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="glass-card p-8 space-y-6"
                >
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
                    </div>


                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5" />
                            <span className="text-sm text-white/60">Remember me</span>
                        </label>
                        <a href="#" className="text-sm text-primary-400 hover:text-primary-300">
                            Forgot password?
                        </a>
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
                                Sign In
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
                        className="btn-secondary w-full flex items-center justify-center gap-2"
                    >
                        <Sparkles className="w-5 h-5 text-accent-400" />
                        Try Demo Mode
                    </motion.button>
                </motion.form>

                {/* Sign Up Link */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-6 text-white/60"
                >
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium">
                        Sign up free
                    </Link>
                </motion.p>
            </motion.div>
        </div>
    )
}

export default LoginPage
