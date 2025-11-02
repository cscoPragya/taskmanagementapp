"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/Login"
import Register from "./components/Register"
import Dashboard from "./components/Dashboard"
import TaskManager from "./components/TaskManager"
import Navbar from "./components/Navbar"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in on app load
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
    console.log(`${import.meta.env.VITE_BACKEND_URL}`)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
    localStorage.removeItem("tasks")
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <Register onLogin={handleLogin} /> : <Navigate to="/dashboard" />}
          />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/tasks" element={isAuthenticated ? <TaskManager user={user} /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
