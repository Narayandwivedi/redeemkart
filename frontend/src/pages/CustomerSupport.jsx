import React, { useState, useEffect, useContext } from 'react'
import { ArrowLeft, Phone, Mail, MessageCircle, Clock, HeadphonesIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const CustomerSupport = () => {
  const navigate = useNavigate()
  const { user } = useContext(AppContext)

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:+91${phoneNumber}`
  }

  const handleEmail = () => {
    window.location.href = 'mailto:support@jainxcomputers.com'
  }

  const handleChatNow = () => {
    navigate('/chat')
  }

  useEffect(() => {
    // Update meta tags for Customer Support page
    document.title = 'Customer Support - JainX Computers | Priority Help for Users'

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get priority customer support for JainX Computers. Live chat, priority tickets, account help, and instant assistance for PC building and computer accessories.')
    }

    return () => {
      document.title = 'JainX Computers - Your Complete PC Building Solution'
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-black px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="mr-3">
              <ArrowLeft className="w-6 h-6 text-white hover:text-blue-300 transition-colors" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-white">Customer Support</h1>
              <p className="text-gray-300 text-sm">Hi {user?.fullName?.split(' ')[0]} ðŸ‘‹</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-blue-500 p-3 rounded-xl shadow-lg">
            <HeadphonesIcon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 max-w-4xl mx-auto">

          {/* Live Chat Support - Redesigned */}
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-2xl p-6 shadow-lg relative overflow-hidden max-w-md mx-auto md:max-w-2xl">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -ml-8 -mb-8"></div>

            <div className="relative">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-xl">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl text-white">Live Chat</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-sm text-white opacity-90">Online now</span>
                  </div>
                </div>
              </div>

              <p className="text-white text-sm opacity-90 mb-6 leading-relaxed">
                Get instant help from our priority support team. Average response time: under 2 minutes
              </p>

              <button
                onClick={handleChatNow}
                className="w-full md:w-auto md:px-8 bg-white text-black font-semibold py-4 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Start Live Chat</span>
              </button>
            </div>
          </div>

          {/* Other Contact Options */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="flex items-center space-x-2 mb-4">
              <Phone className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-800 text-lg">Other Ways to Reach Us</h3>
            </div>

            {/* Phone Numbers */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">+91 9876543210</div>
                    <div className="text-sm text-gray-500">General Support</div>
                  </div>
                </div>
                <button
                  onClick={() => handleCall('9876543210')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors min-w-[60px]"
                >
                  Call
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500 p-2 rounded-lg">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">+91 7894561230</div>
                    <div className="text-sm text-gray-500">Priority Support</div>
                  </div>
                </div>
                <button
                  onClick={() => handleCall('7894561230')}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors min-w-[60px]"
                >
                  Call
                </button>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-500 p-2 rounded-lg">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Email Support</div>
                    <div className="text-xs text-gray-500">support@jainxcomputers.com</div>
                  </div>
                </div>
                <button
                  onClick={handleEmail}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors min-w-[60px]"
                >
                  Email
                </button>
              </div>
            </div>
          </div>

          {/* Support Hours */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 max-w-2xl mx-auto">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gray-600 p-3 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-base">Support Hours</h3>
                <p className="text-gray-600 text-sm">We're here to help</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white rounded-xl p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-700 font-medium">Live Chat</span>
                </div>
                <span className="text-green-600 font-medium">9 AM - 12 AM</span>
              </div>

              <div className="flex items-center justify-between bg-white rounded-xl p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Phone Support</span>
                </div>
                <span className="text-blue-600 font-medium">9 AM - 8 PM</span>
              </div>

              <div className="flex items-center justify-between bg-white rounded-xl p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Email Support</span>
                </div>
                <span className="text-purple-600 font-medium">24/7</span>
              </div>
            </div>
          </div>

      </div>
    </div>
  )
}

export default CustomerSupport