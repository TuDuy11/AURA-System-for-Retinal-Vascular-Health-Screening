import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'

export const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">🔬 AURA System</h1>
          <p className="text-xl mb-6">
            AI-based Retinal Vascular Health Screening System
          </p>
          <p className="text-lg opacity-90 mb-8">
            Early detection of cardiovascular diseases, diabetes, and stroke through retinal image analysis
          </p>
          
          {isAuthenticated ? (
            <div>
              <p className="text-lg mb-4">Welcome back, {user?.fullName}!</p>
              <Link to="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
            </div>
          ) : (
            <div className="flex gap-4 justify-center">
              <Link to="/login">
                <Button size="lg">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Key Features</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📤</div>
            <h3 className="text-xl font-bold mb-2">Easy Upload</h3>
            <p className="text-gray-600">Upload single or multiple retinal images for AI analysis</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2">AI Analysis</h3>
            <p className="text-gray-600">Advanced machine learning for accurate disease risk assessment</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Detailed Reports</h3>
            <p className="text-gray-600">Get comprehensive diagnostic reports with AI explanations</p>
          </div>
        </div>
      </section>

      {/* Role-based Info */}
      <section className="max-w-6xl mx-auto px-4 mb-12">
        <h2 className="text-4xl font-bold text-center mb-12">For Everyone</h2>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
            <h3 className="text-lg font-bold text-blue-900 mb-2">👤 Patients</h3>
            <p className="text-blue-700 text-sm">Upload images, track health history, receive recommendations</p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
            <h3 className="text-lg font-bold text-green-900 mb-2">👨‍⚕️ Doctors</h3>
            <p className="text-green-700 text-sm">Review AI results, validate findings, manage patients</p>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
            <h3 className="text-lg font-bold text-purple-900 mb-2">🏥 Clinics</h3>
            <p className="text-purple-700 text-sm">Bulk analysis, manage screening campaigns, generate reports</p>
          </div>

          <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
            <h3 className="text-lg font-bold text-orange-900 mb-2">⚙️ Admin</h3>
            <p className="text-orange-700 text-sm">System management, user control, AI configuration</p>
          </div>
        </div>
      </section>
    </div>
  )
}