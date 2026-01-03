import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    BarChart3, Users, MapPin, TrendingUp, Plane, Calendar,
    Wallet, Globe2, Activity, ArrowUp, ArrowDown
} from 'lucide-react'
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { useTrip } from '../context/TripContext'
import { formatCurrency } from '../utils/tripUtils'

const AdminAnalytics = () => {
    const { trips } = useTrip()
    const [timeRange, setTimeRange] = useState('week')

    // Calculate analytics data
    const analyticsData = {
        totalTrips: trips.length,
        totalUsers: 1250,
        totalCities: trips.reduce((sum, trip) => sum + (trip.cities?.length || 0), 0),
        totalBudget: trips.reduce((sum, trip) => sum + (trip.totalBudget || 0), 0),
        activeTrips: trips.filter(t => t.status === 'planned').length,
        completedTrips: trips.filter(t => t.status === 'completed').length
    }

    // Sample time series data
    const timeSeriesData = [
        { name: 'Mon', trips: 12, users: 45, revenue: 25000 },
        { name: 'Tue', trips: 18, users: 52, revenue: 32000 },
        { name: 'Wed', trips: 15, users: 48, revenue: 28000 },
        { name: 'Thu', trips: 22, users: 65, revenue: 41000 },
        { name: 'Fri', trips: 28, users: 78, revenue: 52000 },
        { name: 'Sat', trips: 35, users: 92, revenue: 68000 },
        { name: 'Sun', trips: 30, users: 85, revenue: 58000 },
    ]

    // Popular destinations
    const popularDestinations = [
        { name: 'Jaipur', trips: 45, color: '#ff2d5e' },
        { name: 'Goa', trips: 38, color: '#3ba3f5' },
        { name: 'Delhi', trips: 35, color: '#f59e0b' },
        { name: 'Mumbai', trips: 28, color: '#22c55e' },
        { name: 'Kerala', trips: 22, color: '#8b5cf6' },
    ]

    // Trip type distribution
    const tripTypeData = [
        { name: 'Leisure', value: 35, color: '#ff2d5e' },
        { name: 'Adventure', value: 25, color: '#3ba3f5' },
        { name: 'Cultural', value: 20, color: '#f59e0b' },
        { name: 'Family', value: 12, color: '#22c55e' },
        { name: 'Business', value: 8, color: '#8b5cf6' },
    ]

    const statCards = [
        {
            label: 'Total Trips',
            value: analyticsData.totalTrips,
            icon: Plane,
            color: 'from-primary-500 to-pink-500',
            change: '+12%',
            positive: true
        },
        {
            label: 'Active Users',
            value: analyticsData.totalUsers.toLocaleString(),
            icon: Users,
            color: 'from-secondary-500 to-cyan-500',
            change: '+8%',
            positive: true
        },
        {
            label: 'Cities Explored',
            value: analyticsData.totalCities,
            icon: MapPin,
            color: 'from-accent-500 to-orange-500',
            change: '+15%',
            positive: true
        },
        {
            label: 'Total Revenue',
            value: formatCurrency(analyticsData.totalBudget),
            icon: Wallet,
            color: 'from-green-500 to-emerald-500',
            change: '+22%',
            positive: true
        },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="heading-lg mb-2 flex items-center gap-2">
                        <BarChart3 className="w-8 h-8 text-primary-400" />
                        Admin Analytics
                    </h1>
                    <p className="text-white/60">Platform overview and insights</p>
                </div>

                <div className="flex gap-2">
                    {['week', 'month', 'year'].map(range => (
                        <motion.button
                            key={range}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-2 rounded-lg capitalize ${timeRange === range
                                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                                }`}
                        >
                            {range}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="glass-card p-6 relative overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />
                        <div className="relative">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-2xl font-bold mb-1">{stat.value}</div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-white/50">{stat.label}</span>
                                <span className={`text-xs flex items-center gap-1 ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                                    {stat.positive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Trips Over Time */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6"
                >
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary-400" />
                        Trips Created
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={timeSeriesData}>
                            <defs>
                                <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ff2d5e" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ff2d5e" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                            <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(26, 26, 46, 0.95)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="trips"
                                stroke="#ff2d5e"
                                strokeWidth={2}
                                fill="url(#colorTrips)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* User Growth */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6"
                >
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-secondary-400" />
                        User Activity
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={timeSeriesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                            <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(26, 26, 46, 0.95)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="users"
                                stroke="#3ba3f5"
                                strokeWidth={3}
                                dot={{ fill: '#3ba3f5', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Popular Destinations */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6"
                >
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-accent-400" />
                        Popular Destinations
                    </h3>
                    <div className="space-y-4">
                        {popularDestinations.map((dest, index) => (
                            <div key={dest.name} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{dest.name}</span>
                                    <span className="text-sm text-white/50">{dest.trips} trips</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(dest.trips / 50) * 100}%` }}
                                        transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: dest.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Trip Types */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-6"
                >
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Globe2 className="w-5 h-5 text-purple-400" />
                        Trip Types
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={tripTypeData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={70}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {tripTypeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(26, 26, 46, 0.95)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                        {tripTypeData.map(type => (
                            <span
                                key={type.name}
                                className="flex items-center gap-1.5 text-xs"
                            >
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: type.color }} />
                                {type.name}
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="glass-card p-6"
                >
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-green-400" />
                        Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {[
                            { action: 'New trip created', user: 'Priya S.', time: '2 min ago', icon: Plane },
                            { action: 'User signup', user: 'Rahul M.', time: '5 min ago', icon: Users },
                            { action: 'Trip completed', user: 'Sarah C.', time: '12 min ago', icon: TrendingUp },
                            { action: 'City added', user: 'John D.', time: '18 min ago', icon: MapPin },
                            { action: 'Trip shared', user: 'Anita K.', time: '25 min ago', icon: Globe2 },
                        ].map((activity, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                                className="flex items-center gap-3 text-sm"
                            >
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                    <activity.icon className="w-4 h-4 text-white/40" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-white/70">{activity.action}</p>
                                    <p className="text-xs text-white/40">{activity.user}</p>
                                </div>
                                <span className="text-xs text-white/30">{activity.time}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Revenue Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="glass-card p-6"
            >
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-green-400" />
                    Revenue Overview
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                        <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                        <Tooltip
                            contentStyle={{
                                background: 'rgba(26, 26, 46, 0.95)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px'
                            }}
                            formatter={(value) => [formatCurrency(value), 'Revenue']}
                        />
                        <Bar
                            dataKey="revenue"
                            fill="url(#revenueGradient)"
                            radius={[8, 8, 0, 0]}
                        />
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#22c55e" />
                                <stop offset="100%" stopColor="#16a34a" />
                            </linearGradient>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>
        </motion.div>
    )
}

export default AdminAnalytics
