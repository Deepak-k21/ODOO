import { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import api from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState(localStorage.getItem('token'))

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token')
            if (storedToken) {
                try {
                    const decoded = jwtDecode(storedToken)
                    // Check if token is expired
                    if (decoded.exp * 1000 < Date.now()) {
                        logout()
                    } else {
                        setToken(storedToken)
                        // Fetch user data
                        const userData = await api.get('/api/auth/me')
                        setUser(userData.data)
                    }
                } catch (error) {
                    console.error('Auth init error:', error)
                    logout()
                }
            }
            setLoading(false)
        }

        initAuth()
    }, [])

    const login = async (email, password) => {
        try {
            const response = await api.post('/api/auth/login', { email, password })
            const { access_token, user: userData } = response.data

            localStorage.setItem('token', access_token)
            setToken(access_token)
            setUser(userData)

            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Login failed'
            }
        }
    }

    const signup = async (name, email, password) => {
        try {
            const response = await api.post('/api/auth/signup', { name, email, password })
            const { access_token, user: userData } = response.data

            localStorage.setItem('token', access_token)
            setToken(access_token)
            setUser(userData)

            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Signup failed'
            }
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
    }

    const updateUser = async (userData) => {
        try {
            const response = await api.put('/api/auth/profile', userData)
            setUser(response.data)
            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Update failed'
            }
        }
    }

    // Demo mode login
    const demoLogin = async () => {
        const demoUser = {
            id: 'demo-user-001',
            name: 'Demo Traveler',
            email: 'demo@globetrotter.com',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            createdAt: new Date().toISOString()
        }

        const demoToken = 'demo-token-' + Date.now()
        localStorage.setItem('token', demoToken)
        localStorage.setItem('demoMode', 'true')
        setToken(demoToken)
        setUser(demoUser)

        return { success: true }
    }

    const value = {
        user,
        token,
        loading,
        login,
        signup,
        logout,
        updateUser,
        demoLogin,
        isAuthenticated: !!user
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
