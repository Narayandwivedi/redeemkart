import React, { useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { User, Mail, Phone, MapPin, ShoppingBag, Headphones, Edit2, Save, X, Loader } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ProfileInfo = () => {
  const { user, BACKEND_URL, setUser } = useContext(AppContext)
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })
      const result = await response.json()
      if (result.success) {
        toast.success('Profile updated successfully')
        setUser(result.user)
        setIsEditing(false)
      } else {
        throw new Error(result.message || 'Failed to update profile')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || ''
    })
    setIsEditing(false)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your personal information</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Profile Header */}
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black px-5 sm:px-6 py-6">
            <div className="flex items-center gap-4">
              <div className="bg-violet-500 p-3 rounded-full shrink-0">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-semibold text-white truncate">{user?.fullName}</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                  <p className="text-violet-200 text-sm truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-5 sm:p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    <User className="w-3.5 h-3.5" />
                    Full Name
                  </label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} disabled={!isEditing} required
                    className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all duration-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                      !isEditing ? 'bg-gray-50 border-gray-200 text-gray-700 cursor-not-allowed' : 'border-gray-300 bg-white'
                    }`} />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    Email Address
                  </label>
                  <input type="email" value={formData.email} disabled
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed" />
                  <p className="text-[11px] text-gray-400 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    Phone Number
                  </label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing}
                    className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all duration-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                      !isEditing ? 'bg-gray-50 border-gray-200 text-gray-700 cursor-not-allowed' : 'border-gray-300 bg-white'
                    }`} placeholder="Add your phone number" />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  {!isEditing ? (
                    <button type="button" onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-1.5 bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-200 shadow-md hover:shadow-violet-500/40 text-sm cursor-pointer">
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button type="button" onClick={handleCancel} disabled={loading}
                        className="inline-flex items-center gap-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-5 rounded-lg transition-all duration-200 text-sm disabled:opacity-50 cursor-pointer">
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button type="submit" disabled={loading}
                        className="inline-flex items-center gap-1.5 bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-200 shadow-md hover:shadow-violet-500/40 text-sm disabled:opacity-50 cursor-pointer">
                        {loading ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50 border-t border-gray-100 px-5 sm:px-6 py-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button onClick={() => navigate('/manage-addresses')}
                className="flex flex-col items-center justify-center gap-1.5 bg-white border border-gray-200 text-gray-700 hover:border-violet-500 hover:text-violet-700 py-3 px-2 rounded-xl transition-all duration-200 text-[11px] font-medium cursor-pointer">
                <MapPin className="w-5 h-5" />
                <span className="leading-tight text-center">Addresses</span>
              </button>
              <button onClick={() => navigate('/my-orders')}
                className="flex flex-col items-center justify-center gap-1.5 bg-white border border-gray-200 text-gray-700 hover:border-violet-500 hover:text-violet-700 py-3 px-2 rounded-xl transition-all duration-200 text-[11px] font-medium cursor-pointer">
                <ShoppingBag className="w-5 h-5" />
                <span className="leading-tight text-center">Orders</span>
              </button>
              <button onClick={() => navigate('/customer-support')}
                className="flex flex-col items-center justify-center gap-1.5 bg-white border border-gray-200 text-gray-700 hover:border-violet-500 hover:text-violet-700 py-3 px-2 rounded-xl transition-all duration-200 text-[11px] font-medium cursor-pointer">
                <Headphones className="w-5 h-5" />
                <span className="leading-tight text-center">Support</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileInfo
