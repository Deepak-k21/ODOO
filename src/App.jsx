import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from './context/AuthContext'

// Layout
import Layout from './components/layout/Layout'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Dashboard from './pages/Dashboard'
import CreateTrip from './pages/CreateTrip'
import MyTrips from './pages/MyTrips'
import ItineraryBuilder from './pages/ItineraryBuilder'
import ItineraryView from './pages/ItineraryView'
import CitySearch from './pages/CitySearch'
import ActivitySearch from './pages/ActivitySearch'
import TripBudget from './pages/TripBudget'
import TripCalendar from './pages/TripCalendar'
import SharedItinerary from './pages/SharedItinerary'
import ProfileSettings from './pages/ProfileSettings'
import AdminAnalytics from './pages/AdminAnalytics'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen">
      <div className="animated-bg"></div>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/share/:shareId" element={<SharedItinerary />} />

          {/* Protected Routes */}
          <Route path="/app" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="create-trip" element={<CreateTrip />} />
            <Route path="my-trips" element={<MyTrips />} />
            <Route path="trip/:tripId/builder" element={<ItineraryBuilder />} />
            <Route path="trip/:tripId/view" element={<ItineraryView />} />
            <Route path="trip/:tripId/cities" element={<CitySearch />} />
            <Route path="trip/:tripId/activities" element={<ActivitySearch />} />
            <Route path="trip/:tripId/budget" element={<TripBudget />} />
            <Route path="trip/:tripId/calendar" element={<TripCalendar />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="admin" element={<AdminAnalytics />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
