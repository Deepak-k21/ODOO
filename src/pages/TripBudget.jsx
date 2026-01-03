import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    Wallet, TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3,
    ArrowLeft, AlertTriangle, CheckCircle, MapPin, Calendar
} from 'lucide-react'
import {
    AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { useTrip } from '../context/TripContext'
import { formatCurrency, formatDate, getActivityColor } from '../utils/tripUtils'

const TripBudget = () => {
    const { tripId } = useParams()
    const navigate = useNavigate()
    const { getTrip, getTripBudget } = useTrip()

    const [trip, setTrip] = useState(null)
    const [budget, setBudget] = useState(null)

    useEffect(() => {
        const tripData = getTrip(tripId)
        const budgetData = getTripBudget(tripId)
        setTrip(tripData)
        setBudget(budgetData)
    }, [tripId, getTrip, getTripBudget])

    if (!trip || !budget) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="spinner"></div>
            </div>
        )
    }

    const categoryData = Object.entries(budget.byCategory).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value,
        color: getActivityColor(key)
    }))

    const dailyData = budget.byDay.map(day => ({
        name: `Day ${day.dayNumber}`,
        date: formatDate(day.date),
        city: day.city,
        amount: day.total,
        feasibility: day.feasibility
    }))

    const cityData = budget.byCity.map(city => ({
        name: city.name,
        value: city.total,
        days: city.days
    }))

    const COLORS = ['#ff2d5e', '#3ba3f5', '#f59e0b', '#22c55e', '#8b5cf6', '#ec4899']

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
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
                            <Wallet className="w-6 h-6 text-accent-400" />
                            Trip Budget
                        </h1>
                        <p className="text-white/60">{trip.name}</p>
                    </div>
                </div>
            </div>

            {/* Budget Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-primary-400" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">{formatCurrency(budget.total)}</div>
                    <div className="text-sm text-white/50">Total Spent</div>
                    <div className="mt-2 text-xs text-white/40">
                        {budget.percentUsed.toFixed(0)}% of budget used
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                            {budget.remaining >= 0 ? (
                                <TrendingUp className="w-5 h-5 text-green-400" />
                            ) : (
                                <TrendingDown className="w-5 h-5 text-red-400" />
                            )}
                        </div>
                    </div>
                    <div className={`text-3xl font-bold mb-1 ${budget.remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(Math.abs(budget.remaining))}
                    </div>
                    <div className="text-sm text-white/50">
                        {budget.remaining >= 0 ? 'Remaining' : 'Over Budget'}
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary-500/20 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-secondary-400" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">{formatCurrency(budget.dailyAverage)}</div>
                    <div className="text-sm text-white/50">Daily Average</div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-accent-400" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">{formatCurrency(budget.perPersonDaily)}</div>
                    <div className="text-sm text-white/50">Per Person/Day</div>
                </motion.div>
            </div>

            {/* Budget Progress */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
            >
                <h3 className="font-semibold text-lg mb-4">Budget Progress</h3>
                <div className="relative h-4 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(budget.percentUsed, 100)}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`absolute h-full rounded-full ${budget.percentUsed > 100 ? 'bg-red-500' :
                                budget.percentUsed > 80 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                    />
                </div>
                <div className="flex justify-between mt-2 text-sm text-white/50">
                    <span>{formatCurrency(budget.total)} spent</span>
                    <span>{formatCurrency(trip.totalBudget)} budget</span>
                </div>
            </motion.div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Daily Spending Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6"
                >
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-secondary-400" />
                        Daily Spending
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={dailyData}>
                            <defs>
                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3ba3f5" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3ba3f5" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                            <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(26, 26, 46, 0.95)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px'
                                }}
                                formatter={(value) => [formatCurrency(value), 'Spent']}
                                labelFormatter={(label, payload) => payload[0]?.payload?.city || label}
                            />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="#3ba3f5"
                                strokeWidth={2}
                                fill="url(#colorAmount)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Category Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6"
                >
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-primary-400" />
                        Category Breakdown
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <RechartsPie>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(26, 26, 46, 0.95)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px'
                                }}
                                formatter={(value) => formatCurrency(value)}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                formatter={(value) => <span className="text-white/70">{value}</span>}
                            />
                        </RechartsPie>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* City Spending */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-6"
            >
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-accent-400" />
                    Spending by City
                </h3>
                <div className="space-y-4">
                    {cityData.map((city, index) => {
                        const percentage = budget.total > 0 ? (city.value / budget.total) * 100 : 0
                        return (
                            <motion.div
                                key={city.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                        />
                                        <span className="font-medium">{city.name}</span>
                                        <span className="text-sm text-white/50">{city.days} days</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold">{formatCurrency(city.value)}</span>
                                        <span className="text-sm text-white/50 ml-2">({percentage.toFixed(0)}%)</span>
                                    </div>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </motion.div>

            {/* Over Budget Days Warning */}
            {budget.overBudgetDays.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-6 border-yellow-500/30"
                >
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-yellow-400">
                        <AlertTriangle className="w-5 h-5" />
                        High Spending Days
                    </h3>
                    <p className="text-white/60 mb-4">
                        These days exceed your daily budget average by more than 20%
                    </p>
                    <div className="space-y-3">
                        {budget.overBudgetDays.map((day, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-xl bg-yellow-500/10"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center font-bold text-yellow-400">
                                        {day.dayNumber}
                                    </div>
                                    <div>
                                        <div className="font-medium">{day.city}</div>
                                        <div className="text-sm text-white/50">{formatDate(day.date)}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-yellow-400">{formatCurrency(day.spent)}</div>
                                    <div className="text-xs text-white/50">
                                        +{formatCurrency(day.spent - day.threshold)} over average
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Daily Breakdown Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass-card p-6 overflow-x-auto"
            >
                <h3 className="font-semibold text-lg mb-4">Daily Breakdown</h3>
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-white/50 text-sm">
                            <th className="pb-3">Day</th>
                            <th className="pb-3">Date</th>
                            <th className="pb-3">City</th>
                            <th className="pb-3">Feasibility</th>
                            <th className="pb-3 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dailyData.map((day, index) => (
                            <motion.tr
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 + index * 0.05 }}
                                className="border-t border-white/5"
                            >
                                <td className="py-3 font-medium">{day.name}</td>
                                <td className="py-3 text-white/60">{day.date}</td>
                                <td className="py-3 text-white/60">{day.city}</td>
                                <td className="py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs ${day.feasibility === 'smooth' ? 'bg-green-500/20 text-green-400' :
                                            day.feasibility === 'tight' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-red-500/20 text-red-400'
                                        }`}>
                                        {day.feasibility}
                                    </span>
                                </td>
                                <td className="py-3 text-right font-bold">{formatCurrency(day.amount)}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>
        </motion.div>
    )
}

export default TripBudget
