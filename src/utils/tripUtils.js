// Trip Feasibility Calculator
// Analyzes activity density and travel gaps to determine day status

export const calculateFeasibility = (activities) => {
    if (!activities || activities.length === 0) return 'smooth'

    // Calculate total activity time in minutes
    const totalTime = activities.reduce((sum, act) => sum + (act.duration || 0), 0)

    // Count number of activities
    const activityCount = activities.length

    // Check for time gaps (activities too close together)
    const sortedActivities = [...activities].sort((a, b) => {
        const timeA = a.time ? parseInt(a.time.replace(':', '')) : 0
        const timeB = b.time ? parseInt(b.time.replace(':', '')) : 0
        return timeA - timeB
    })

    let hasOverlap = false
    for (let i = 1; i < sortedActivities.length; i++) {
        const prevEnd = getActivityEndTime(sortedActivities[i - 1])
        const currStart = getTimeInMinutes(sortedActivities[i].time)

        if (currStart < prevEnd + 30) { // Less than 30 min gap
            hasOverlap = true
            break
        }
    }

    // Determine feasibility
    if (activityCount > 5 || totalTime > 720 || hasOverlap) { // 720 min = 12 hours
        return 'overloaded'
    } else if (activityCount > 3 || totalTime > 480) { // 480 min = 8 hours
        return 'tight'
    }

    return 'smooth'
}

const getTimeInMinutes = (timeStr) => {
    if (!timeStr) return 0
    const [hours, minutes] = timeStr.split(':').map(Number)
    return hours * 60 + minutes
}

const getActivityEndTime = (activity) => {
    const startMinutes = getTimeInMinutes(activity.time)
    return startMinutes + (activity.duration || 60)
}

// Budget Calculator
export const calculateBudget = (trip) => {
    if (!trip || !trip.cities) {
        return {
            total: 0,
            byCity: [],
            byDay: [],
            byCategory: {},
            dailyAverage: 0,
            perPersonDaily: 0,
            overBudgetDays: []
        }
    }

    const byCity = []
    const byDay = []
    const byCategory = {}
    let total = 0
    let totalDays = 0
    const overBudgetDays = []
    const dailyThreshold = (trip.totalBudget || 50000) / (trip.cities.reduce((sum, c) => sum + (c.days?.length || 0), 0) || 1)

    trip.cities.forEach(city => {
        let cityTotal = 0

        city.days?.forEach(day => {
            let dayTotal = 0

            day.activities?.forEach(activity => {
                const cost = activity.cost || 0
                dayTotal += cost
                total += cost

                // Group by category
                const category = activity.type || 'other'
                byCategory[category] = (byCategory[category] || 0) + cost
            })

            byDay.push({
                date: day.date,
                dayNumber: day.dayNumber,
                city: city.name,
                total: dayTotal,
                activityCount: day.activities?.length || 0,
                feasibility: day.feasibility
            })

            cityTotal += dayTotal
            totalDays++

            if (dayTotal > dailyThreshold * 1.2) {
                overBudgetDays.push({
                    date: day.date,
                    dayNumber: day.dayNumber,
                    city: city.name,
                    spent: dayTotal,
                    threshold: dailyThreshold
                })
            }
        })

        byCity.push({
            id: city.id,
            name: city.name,
            total: cityTotal,
            days: city.days?.length || 0
        })
    })

    return {
        total,
        byCity,
        byDay,
        byCategory,
        dailyAverage: totalDays > 0 ? total / totalDays : 0,
        perPersonDaily: totalDays > 0 && trip.travelerCount ? total / totalDays / trip.travelerCount : 0,
        overBudgetDays,
        remaining: (trip.totalBudget || 0) - total,
        percentUsed: trip.totalBudget ? (total / trip.totalBudget) * 100 : 0
    }
}

// Format currency
export const formatCurrency = (amount, currency = 'INR') => {
    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })
    return formatter.format(amount)
}

// Format date
export const formatDate = (dateStr, format = 'short') => {
    const date = new Date(dateStr)

    if (format === 'short') {
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short'
        })
    } else if (format === 'long') {
        return date.toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    } else if (format === 'day') {
        return date.toLocaleDateString('en-IN', {
            weekday: 'short'
        })
    }

    return dateStr
}

// Calculate trip duration
export const getTripDuration = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
}

// Generate date range
export const generateDateRange = (startDate, days) => {
    const dates = []
    const start = new Date(startDate)

    for (let i = 0; i < days; i++) {
        const date = new Date(start)
        date.setDate(start.getDate() + i)
        dates.push(date.toISOString().split('T')[0])
    }

    return dates
}

// Activity type icons
export const getActivityIcon = (type) => {
    const icons = {
        transport: '🚗',
        accommodation: '🏨',
        sightseeing: '📸',
        food: '🍽️',
        shopping: '🛍️',
        entertainment: '🎭',
        experience: '🎯',
        wellness: '💆',
        adventure: '🏔️',
        beach: '🏖️',
        culture: '🏛️',
        nightlife: '🌃',
        other: '📍'
    }
    return icons[type] || icons.other
}

// Activity type colors
export const getActivityColor = (type) => {
    const colors = {
        transport: '#3ba3f5',
        accommodation: '#8b5cf6',
        sightseeing: '#f59e0b',
        food: '#ef4444',
        shopping: '#ec4899',
        entertainment: '#06b6d4',
        experience: '#22c55e',
        wellness: '#84cc16',
        adventure: '#f97316',
        beach: '#06b6d4',
        culture: '#a855f7',
        nightlife: '#6366f1',
        other: '#71717a'
    }
    return colors[type] || colors.other
}

// Feasibility labels
export const getFeasibilityLabel = (feasibility) => {
    const labels = {
        smooth: { text: 'Smooth ✅', class: 'badge-smooth' },
        tight: { text: 'Tight ⚠️', class: 'badge-tight' },
        overloaded: { text: 'Overloaded ❌', class: 'badge-overloaded' }
    }
    return labels[feasibility] || labels.smooth
}

// Generate unique ID
export const generateId = (prefix = 'id') => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Debounce function
export const debounce = (func, wait) => {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

// Deep clone
export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj))
}
