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
import CreateBoard from '../pages/CreateBoard.jsx'

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Root route - Redirects based on auth status */}
      <Route path="/" element={user ? <Navigate to="/home" /> : <Landing />} />

      {/* Auth Routes */}
      <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/home" /> : <Register />} />

      {/* Protected Routes */}
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="home" element={<Dashboard />} />
        <Route path="create-board" element={<CreateBoard />} />
        <Route path="your-dashboard" element={<YourDashboard />} />
        <Route path="whiteboard/:id" element={<Whiteboard />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes