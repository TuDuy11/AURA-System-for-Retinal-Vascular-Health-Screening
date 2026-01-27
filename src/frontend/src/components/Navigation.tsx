import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const Navigation: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <nav className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold">
            🔬 AURA
          </Link>

          <div className="flex gap-6 items-center">
            {isAuthenticated ? (
              <>
                <span className="text-sm">Welcome, {user?.fullName}</span>
                <span className="text-xs bg-white bg-opacity-20 px-3 py-1 rounded">
                  {user?.role.toUpperCase()}
                </span>
                <button
                  onClick={logout}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="hover:bg-white hover:bg-opacity-10 px-4 py-2 rounded transition"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-primary px-4 py-2 rounded hover:bg-opacity-90 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}