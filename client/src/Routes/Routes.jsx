import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from '../pages/Landing.jsx'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'
import Whiteboard from '../pages/Whiteboard.jsx'
import YourDashboard from '../pages/YourDashboard.jsx'
import PrivateRoute from '../components/auth/PrivateRoute.jsx'
import Layout from '../components/layout/Layout.jsx'
import { useAuth } from '../hooks/useAuth'
import Dashboard from '../pages/Dashboard.jsx'
import Header from '../components/layout/Header.jsx'
import Features from '../pages/Features.jsx'
import Footer from '../components/layout/Footer.jsx'
import StarredWhiteboards from '../pages/StarredWhiteboards.jsx'
import RecentWhiteboards from '../pages/RecentWhiteboards.jsx'
import SharedElements from '../pages/SharedElements.jsx'
import Profile from '../pages/Profile.jsx'
import Settings from '../pages/Settings.jsx'

function AppRoutes() {
  const { user } = useAuth();

  const showHeaderAndLanding = () => (
    user ? <Navigate to="/home" /> : (
      <>
        <Header />
        <Landing />
        <Features />
        <Footer />
      </>
    )
  )

  return (
    <Routes>
      {/* Root route - Redirects based on auth status */}
      <Route path="/" element={showHeaderAndLanding()} />

      {/* Auth Routes */}
      <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/home" /> : <Register />} />

      {/* Protected Routes */}
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="home" element={<Dashboard />} />
        <Route path="your-dashboard" element={<YourDashboard />} />
        <Route path="whiteboard/:id" element={<Whiteboard />} />
        <Route path="/starred" element={<StarredWhiteboards />} />
        <Route path="/recent" element={<RecentWhiteboards />} />
        <Route path="/shared-elements" element={<SharedElements />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default AppRoutes