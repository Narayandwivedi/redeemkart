import React, { useState, useContext, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { AppContext } from '../context/AppContext'


const Navbar = () => {
  // State Management
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { getTotalItems } = useCart()
  const { isAuthenticated, user, logout } = useContext(AppContext) || {}
  const dropdownRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = (e) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`)
      setSearchQuery('')
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <nav className="bg-gray-100 shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-[55px] md:h-[90px] relative">
          {/* Mobile Back Button OR Hamburger Menu */}
          {location.pathname === '/' ? (
            <div className="md:hidden flex items-center w-10">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-md transition-colors duration-200 cursor-pointer ${mobileMenuOpen ? 'text-blue-600 bg-gray-200' : 'text-gray-700 hover:text-blue-600'}`}
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          ) : (
            <div className="md:hidden flex items-center w-10">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-700 hover:text-blue-600 cursor-pointer"
                aria-label="Back"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          )}

          {/* Logo Section - left on home, centered on other pages (mobile) */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center flex-shrink-0 -ml-2 md:-ml-4">
            <img src="/favicon.png" alt="" className="h-10 md:h-12 w-auto object-contain mr-2" />
            <img src="/redeemkart-logo.png" alt="RedeemKart" className="h-9 md:h-11 w-auto object-contain mt-1" />
          </Link>

          {/* Desktop Search - centered */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-xl mx-auto px-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-5 pr-12 py-2.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-gray-50 hover:bg-white transition-colors shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-violet-500 text-white rounded-full hover:bg-violet-500 transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Desktop Right Actions + Mobile Toggle */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
            {/* Desktop Cart + Login/Profile */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/sell-gift-card"
                className="animate-pulse bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-green-500/50 transform hover:scale-105 cursor-pointer"
              >
                Sell Your Gift Card +
              </Link>
              <Link 
                to="/cart" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group cursor-pointer"
              >
                <div className="flex items-center space-x-1">
                  <img src="/cart.avif" alt="Cart" className="w-6 h-6 object-contain" />
                  <span>Cart</span>
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                      {getTotalItems()}
                    </span>
                  )}
                </div>
              </Link>

              {!isAuthenticated && (
                <Link 
                  to="/login" 
                  className="bg-violet-500 hover:bg-violet-300 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-violet-500/50 transform hover:scale-105 cursor-pointer"
                >
                  <span>Login</span>
                </Link>
              )}

              {isAuthenticated && user && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="hidden md:block">{user.fullName}</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50">
                      <Link
                        to="/my-orders"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition-all duration-200"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6m-6 0h6" />
                        </svg>
                        My Orders
                      </Link>
                      <Link
                        to="/my-sales"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition-all duration-200"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        My Sales
                      </Link>
                      <Link
                        to="/profile-info"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition-all duration-200"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile Info
                      </Link>
                      <Link
                        to="/payout-details"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition-all duration-200"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Payout Details
                      </Link>
                      <Link
                        to="/customer-support"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition-all duration-200"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Customer Support
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => { logout(); setProfileDropdownOpen(false); navigate('/') }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Search Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className={`p-2 rounded-md transition-colors duration-200 cursor-pointer ${mobileSearchOpen ? 'text-blue-600 bg-gray-200' : 'text-gray-700 hover:text-blue-600'}`}
                aria-label="Search"
              >
                <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Dropdown */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-4 pt-1 border-t border-gray-200 bg-gray-100 animate-fadeIn">
          <form onSubmit={(e) => { handleSearch(e); setMobileSearchOpen(false); }} className="flex items-center w-full">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                autoFocus
                className="w-full pl-5 pr-12 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white transition-colors shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-violet-500 text-white rounded-full hover:bg-violet-500 transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div ref={mobileMenuRef} className="absolute top-0 left-0 h-full w-[85%] max-w-sm bg-gray-100 shadow-2xl overflow-y-auto animate-slide-in-left">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white sticky top-0 z-10">
              <Link to="/" className="flex items-center flex-shrink-0">
                <img src="/favicon.png" alt="" className="h-9 w-auto object-contain mr-2" />
                <img src="/redeemkart-logo.png" alt="RedeemKart" className="h-8 w-auto object-contain" />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="px-4 py-3">
            <p className="px-3 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Quick Actions
            </p>
            <Link to="/sell-gift-card" className="flex items-center px-3 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-green-500/40 cursor-pointer mb-1.5">
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Sell Gift Card
            </Link>
            <Link to="/gift-cards" className="flex items-center px-3 py-2.5 text-sm font-semibold text-white bg-violet-500 hover:bg-violet-400 rounded-lg transition-colors duration-150 shadow-md hover:shadow-violet-500/40 cursor-pointer mb-1.5">
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Buy Gift Card
            </Link>
            <Link to="/gift-card/google-play" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-150 cursor-pointer">
              <span className="w-4 h-4 mr-3 flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.523 12.267c0 .44-.05.778-.149 1.014-.1.24-.248.433-.448.578-.2.145-.444.216-.729.216-.35 0-.63-.108-.84-.324-.211-.216-.317-.54-.317-.972 0-.378.104-.66.31-.847.21-.187.473-.28.786-.28.313 0 .585.098.817.292.235.2.398.504.398.912v.411zm-2.48 2.6c.14.185.3.323.487.417.186.096.408.143.668.143.384 0 .733-.096 1.048-.288.313-.19.56-.46.74-.811.18-.35.27-.76.27-1.23 0-.572-.11-1.05-.33-1.43-.22-.382-.526-.67-.918-.865-.392-.194-.842-.292-1.35-.292-.51 0-.957.093-1.34.28-.384.186-.693.457-.927.81-.236.354-.355.78-.355 1.28 0 .527.11.996.333 1.407.222.41.535.72.938.928.405.21.857.314 1.356.314h.438c.21 0 .42-.037.63-.11a1.72 1.72 0 01-.353-.366l.01-.003z" />
                </svg>
              </span>
              Buy Google Play Card
            </Link>

            <div className="border-t border-gray-200 my-2"></div>
            <Link to="/" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-150 cursor-pointer">
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <Link to="/games" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-150 cursor-pointer">
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13l6.318-6.318a4.5 4.5 0 016.364 0L22 13M3 13h18m-15.5 0a2.5 2.5 0 00-2.5 2.5V18a2.5 2.5 0 002.5 2.5h13A2.5 2.5 0 0020.5 18v-2.5a2.5 2.5 0 00-2.5-2.5h-13z" />
              </svg>
              Games
            </Link>
            <Link to="/blog" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-150 cursor-pointer">
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h10" />
              </svg>
              Blog
            </Link>
            <Link to="/about" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-150 cursor-pointer">
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About
            </Link>
            <Link to="/contact" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-150 cursor-pointer">
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Contact
            </Link>
            <Link to="/customer-support" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-150 cursor-pointer">
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9V7a6 6 0 10-12 0v2m12 0a3 3 0 013 3v3a3 3 0 01-3 3h-2v-8h2zm-12 0a3 3 0 00-3 3v3a3 3 0 003 3h2v-8H6z" />
              </svg>
              Customer Support
            </Link>
            <Link to="/refund-policy" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-150 cursor-pointer">
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Refund Policy
            </Link>
            <Link to="/privacy-policy" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-150 cursor-pointer">
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Privacy Policy
            </Link>
            <div className="border-t border-gray-200 my-2"></div>
            {isAuthenticated ? (
              <Link to="/account" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-150 cursor-pointer">
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Account
              </Link>
            ) : (
              <Link to="/login" className="flex items-center px-3 py-2.5 text-sm font-semibold text-white bg-violet-500 hover:bg-violet-400 rounded-lg transition-colors duration-150 cursor-pointer">
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </Link>
            )}
            </nav>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
