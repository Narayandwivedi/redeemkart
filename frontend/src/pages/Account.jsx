import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { ShoppingBag, MapPin, User, Headphones, Banknote, ShieldCheck, CheckCircle, Clock, XCircle, Gift } from 'lucide-react'

const Account = () => {
  const { user } = useContext(AppContext) || {}

  const accountOptions = [
    {
      title: 'My Orders',
      description: 'View your order history and track current orders',
      path: '/my-orders',
      icon: <ShoppingBag className="w-6 h-6" />
    },
    {
      title: 'My Sales',
      description: 'Track your gift card sales and earnings',
      path: '/my-sales',
      icon: <Gift className="w-6 h-6" />
    },
    {
      title: 'Manage Addresses',
      description: 'Add, edit, or remove your delivery addresses',
      path: '/manage-addresses',
      icon: <MapPin className="w-6 h-6" />
    },
    {
      title: 'Profile Information',
      description: 'Update your personal information',
      path: '/profile-info',
      icon: <User className="w-6 h-6" />
    },
    {
      title: 'Payout Details',
      description: 'Manage your bank account for payouts',
      path: '/payout-details',
      icon: <Banknote className="w-6 h-6" />
    },
    {
      title: 'KYC Verification',
      description: user?.kycStatus === 'verified'
        ? 'Your identity is verified'
        : user?.kycStatus === 'pending'
          ? 'Your KYC is under review'
          : 'Verify your identity with Aadhaar, PAN, Licence or Passport',
      path: '/kyc',
      icon: <ShieldCheck className="w-6 h-6" />
    },
    {
      title: 'Customer Support',
      description: 'Get help with your orders and account',
      path: '/customer-support',
      icon: <Headphones className="w-6 h-6" />
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-12">
      <div className="max-w-md md:max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header - Different for Mobile vs Desktop */}
        <div className="text-center md:text-left mb-8">
          {/* Mobile Header */}
          <div className="md:hidden">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">My Account</h1>
            <p className="text-gray-600">Hello, {user?.fullName || 'User'}!</p>
          </div>
          
          {/* Desktop Header */}
          <div className="hidden md:block bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                  Welcome back, {user?.fullName || 'User'}!
                </h1>
                <p className="text-lg text-gray-600">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Options - Responsive Layout */}
        <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-2 md:gap-6">
          {accountOptions.map((option, index) => (
            <Link
              key={index}
              to={option.path}
              className="bg-white rounded-lg p-4 md:p-6 flex items-center justify-between md:justify-start hover:bg-gray-50 md:hover:shadow-md border border-gray-200 md:hover:border-emerald-300 transition-all duration-200"
            >
              {/* Mobile Layout */}
              <div className="flex items-center space-x-3 md:hidden w-full">
                <div className="text-gray-600">
                  {option.icon}
                </div>
                <span className="font-medium text-gray-900 flex-1">{option.title}</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex md:items-start md:space-x-4 w-full">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-lg flex items-center justify-center text-emerald-600">
                    {option.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-gray-600">
                    {option.description}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop Stats Section */}
        <div className="hidden md:block mt-12 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-medium text-gray-900 mb-6">Account Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg">
              <div className="text-3xl font-semibold text-emerald-600 mb-2">0</div>
              <div className="text-gray-700 font-medium">Active Orders</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-3xl font-semibold text-blue-600 mb-2">0</div>
              <div className="text-gray-700 font-medium">Total Orders</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="text-3xl font-semibold text-purple-600 mb-2">1</div>
              <div className="text-gray-700 font-medium">Saved Addresses</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account