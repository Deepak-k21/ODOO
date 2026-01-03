import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Home, Map, PlusCircle, Calendar, User, LogOut, Menu, X,
    Globe2, Plane, Settings, BarChart3, ChevronRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { user, logout } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const navItems = [
        { path: '/app/dashboard', icon: Home, label: 'Dashboard' },
        { path: '/app/create-trip', icon: PlusCircle, label: 'Create Trip' },
        { path: '/app/my-trips', icon: Map, label: 'My Trips' },
        { path: '/app/profile', icon: User, label: 'Profile' },
    ]

    const isActive = (path) => location.pathname === path

    return (
        <div className="min-h-screen flex">
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: sidebarOpen ? 280 : 80 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="hidden lg:flex flex-col fixed left-0 top-0 h-screen z-50 glass-card-dark border-r border-white/10"
            >

                {/* Logo Area */}
                <div className="h-24 px-6 flex items-center justify-between border-b border-white/5">
                    <Link to="/app/dashboard" className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/20"
                        >
                            <Globe2 className="w-6 h-6 text-white" />
                        </motion.div>
                        <AnimatePresence mode="wait">
                            {sidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="font-bold text-xl gradient-text whitespace-nowrap"
                                >
                                    GlobeTrotter
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                    {sidebarOpen && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSidebarOpen(false)}
                            className="p-1.5 rounded-lg text-white/40 hover:text-white transition-all underline-none bg-transparent border-none cursor-pointer"
                        >
                            <ChevronRight className="w-5 h-5 rotate-180" />
                        </motion.button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-8 space-y-1.5 overflow-y-auto no-scrollbar">
                    {!sidebarOpen && (
                        <div className="flex justify-center mb-6">
                            <motion.button
                                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSidebarOpen(true)}
                                className="p-2 rounded-lg text-white/40 hover:text-white transition-all bg-transparent border-none cursor-pointer"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </motion.button>
                        </div>
                    )}
                    {navItems.map((item) => (
                        <Link key={item.path} to={item.path} className="block no-underline">
                            <motion.div
                                whileHover={{ x: 4 }}
                                className={`flex items-center gap-4 px-3.5 py-3.5 rounded-xl transition-all duration-300 relative group ${isActive(item.path)
                                    ? 'bg-gradient-to-r from-primary-500/15 to-secondary-500/15 text-white'
                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                                    } ${sidebarOpen ? '' : 'justify-center'}`}
                            >
                                {isActive(item.path) && (
                                    <motion.div
                                        layoutId="activeNavIndicator"
                                        className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-r-full"
                                    />
                                )}
                                <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive(item.path) ? 'text-primary-400' : 'group-hover:text-primary-300'}`} />
                                <AnimatePresence mode="wait">
                                    {sidebarOpen && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="font-medium whitespace-nowrap"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                {!sidebarOpen && (
                                    <div className="absolute left-full ml-4 px-3 py-2 bg-[#0a0a14] border border-white/10 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl shadow-black/50">
                                        {item.label}
                                    </div>
                                )}
                            </motion.div>
                        </Link>
                    ))}
                </nav>


                {/* User Section Area */}
                <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                    <div className={`flex items-center gap-3 ${sidebarOpen ? 'px-2' : 'justify-center'}`}>
                        <div className="relative flex-shrink-0">
                            <motion.img
                                whileHover={{ scale: 1.1 }}
                                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=ff2d5e&color=fff`}
                                alt={user?.name}
                                className="w-10 h-10 rounded-xl border border-white/10 object-cover shadow-lg"
                            />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#1a1a2e] rounded-full" />
                        </div>
                        <AnimatePresence mode="wait">
                            {sidebarOpen && (
                                <motion.div
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -5 }}
                                    className="flex-1 overflow-hidden"
                                >
                                    <p className="font-semibold text-sm text-white truncate">{user?.name || 'Explorer'}</p>
                                    <p className="text-[10px] text-white/40 truncate uppercase tracking-wider font-bold">Pro Account</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(239, 68, 68, 0.15)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className={`mt-4 w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 text-white/50 hover:text-red-400 transition-all border-none cursor-pointer ${sidebarOpen ? '' : 'justify-center'
                            }`}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && <span className="font-medium">Logout</span>}
                    </motion.button>
                </div>
            </motion.aside>


            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-card-dark border-b border-white/5">
                <div className="flex items-center justify-between p-4">
                    <Link to="/app/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                            <Globe2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg gradient-text">GlobeTrotter</span>
                    </Link>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-lg hover:bg-white/10"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-white/5"
                        >
                            <nav className="p-4 space-y-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.path)
                                            ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20'
                                            : 'hover:bg-white/5'
                                            }`}>
                                            <item.icon className="w-5 h-5" />
                                            <span className="font-medium">{item.label}</span>
                                        </div>
                                    </Link>
                                ))}
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-400"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-medium">Logout</span>
                                </button>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Main Content Area */}
            <main
                className={`flex-1 min-w-0 transition-all duration-500 ease-[0.4, 0, 0.2, 1] pt-16 lg:pt-0 overflow-x-hidden ${sidebarOpen ? 'lg:pl-[280px]' : 'lg:pl-20'}`}
            >
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="min-h-screen p-6 lg:p-10 max-w-screen-2xl mx-auto"
                >
                    <Outlet />
                </motion.div>
            </main>



        </div>
    )
}

export default Layout
