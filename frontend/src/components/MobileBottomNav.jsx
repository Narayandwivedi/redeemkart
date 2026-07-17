import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { AppContext } from '../context/AppContext'

const MobileBottomNav = () => {
  const location = useLocation()
  const { getTotalItems } = useCart()
  const { isAuthenticated } = useContext(AppContext) || {}

  const isActive = (path) => location.pathname === path

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">

      {/* Nav Bar */}
      <div
        className="flex items-center justify-around px-6"
        style={{
          height: 64,
          background: 'rgba(255,255,255,0.98)',
          boxShadow: '0 -1px 0 rgba(0,0,0,0.07), 0 -6px 24px rgba(0,0,0,0.09)',
          borderTop: '1.5px solid rgba(139,92,246,0.28)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        {/* HOME */}
        <Link to="/" className="flex flex-col items-center gap-0.5 relative" style={{ minWidth: 56 }}>
          <span
            className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200"
            style={{
              background: isActive('/') ? 'rgba(139,92,246,0.15)' : 'transparent',
              color: isActive('/') ? '#7c3aed' : '#6b7280',
            }}
          >
            <svg className="w-[22px] h-[22px]" fill={isActive('/') ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </span>
          <span className="text-[12px] font-medium leading-none" style={{ color: isActive('/') ? '#7c3aed' : '#9ca3af' }}>
            Home
          </span>
        </Link>

        {/* SELL CARD */}
        <Link to="/sell-gift-card" className="flex flex-col items-center gap-0.5 relative" style={{ minWidth: 56 }}>
          <span
            className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200"
            style={{
              background: isActive('/sell-gift-card') ? 'rgba(139,92,246,0.15)' : 'transparent',
              color: isActive('/sell-gift-card') ? '#7c3aed' : '#6b7280',
            }}
          >
            <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </span>
          <span className="text-[12px] font-medium leading-none" style={{ color: isActive('/sell-gift-card') ? '#7c3aed' : '#9ca3af' }}>
            Sell Card
          </span>
        </Link>

        {/* CART */}
        <Link to="/cart" className="flex flex-col items-center gap-0.5 relative" style={{ minWidth: 56 }}>
          <span
            className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200"
            style={{
              background: isActive('/cart') ? 'rgba(139,92,246,0.15)' : 'transparent',
              color: isActive('/cart') ? '#7c3aed' : '#6b7280',
            }}
          >
            <img src="/cart.avif" alt="Cart" className="w-[22px] h-[22px] object-contain" />
          </span>
          <span className="text-[12px] font-medium leading-none" style={{ color: isActive('/cart') ? '#7c3aed' : '#9ca3af' }}>
            Cart
          </span>
          {getTotalItems() > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-semibold rounded-full h-[18px] w-[18px] flex items-center justify-center shadow">
              {getTotalItems()}
            </span>
          )}
        </Link>

        {/* ACCOUNT / LOGIN */}
        <Link to={isAuthenticated ? '/account' : '/login'} className="flex flex-col items-center gap-0.5 relative" style={{ minWidth: 56 }}>
          <span
            className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200"
            style={{
              background: isActive('/account') || isActive('/login') ? 'rgba(139,92,246,0.15)' : 'transparent',
              color: isActive('/account') || isActive('/login') ? '#7c3aed' : '#6b7280',
            }}
          >
            <svg className="w-[22px] h-[22px]" fill={isActive('/account') || isActive('/login') ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
          <span className="text-[12px] font-medium leading-none" style={{ color: isActive('/account') || isActive('/login') ? '#7c3aed' : '#9ca3af' }}>
            {isAuthenticated ? 'Account' : 'Login'}
          </span>
        </Link>
      </div>
    </div>
  )
}

export default MobileBottomNav
