import React from 'react'
import { useAuth } from '../context/AuthContext'

export const Dashboard: React.FC = () => {
  const { user } = useAuth()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-gray-600 text-sm font-medium">Welcome</h3>
          <p className="text-2xl font-bold text-primary">{user?.fullName}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-gray-600 text-sm font-medium">Role</h3>
          <p className="text-2xl font-bold text-secondary">{user?.role.toUpperCase()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-gray-600 text-sm font-medium">Email</h3>
          <p className="text-lg font-mono text-gray-700">{user?.email}</p>
        </div>
      </div>

      {/* Role-specific content */}
      {user?.role === 'patient' && (
        <PatientDashboard />
      )}

      {user?.role === 'doctor' && (
        <DoctorDashboard />
      )}

      {user?.role === 'clinic' && (
        <ClinicDashboard />
      )}

      {user?.role === 'admin' && (
        <AdminDashboard />
      )}
    </div>
  )
}

const PatientDashboard = () => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Upload Retinal Image</h2>
      <input type="file" accept="image/*" className="w-full" />
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-2">Recent Analyses</h3>
        <p className="text-gray-600">No analyses yet</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-2">Health Recommendations</h3>
        <p className="text-gray-600">No recommendations</p>
      </div>
    </div>
  </div>
)

const DoctorDashboard = () => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Patient Management</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Patient Name</th>
              <th className="p-3">Latest Analysis</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td colSpan={3} className="p-3 text-gray-600">No patients assigned yet</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
)

const ClinicDashboard = () => (
  <div className="space-y-6">
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-blue-900">Total Analyses</h3>
        <p className="text-3xl font-bold text-blue-700">0</p>
      </div>

      <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-green-900">Active Patients</h3>
        <p className="text-3xl font-bold text-green-700">0</p>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-purple-900">Doctors</h3>
        <p className="text-3xl font-bold text-purple-700">0</p>
      </div>
    </div>
  </div>
)

const AdminDashboard = () => (
  <div className="space-y-6">
    <div className="grid md:grid-cols-4 gap-6">
      <div className="bg-red-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-red-900">Total Users</h3>
        <p className="text-3xl font-bold text-red-700">0</p>
      </div>

      <div className="bg-yellow-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-yellow-900">Clinics</h3>
        <p className="text-3xl font-bold text-yellow-700">0</p>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-blue-900">Analyses</h3>
        <p className="text-3xl font-bold text-blue-700">0</p>
      </div>

      <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-green-900">Revenue</h3>
        <p className="text-3xl font-bold text-green-700">$0</p>
      </div>
    </div>
  </div>
)