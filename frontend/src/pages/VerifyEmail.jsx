import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { AppContext } from '../context/AppContext'
import { useSEO } from '../hooks/useSEO'
import VerifyEmailBanner from '../components/VerifyEmailBanner'

// Opened from the "Verify my email" button in the verification email: /verify-email?token=...
const VerifyEmail = () => {
  const { BACKEND_URL, user, isAuthenticated, checkAuthStatus } = useContext(AppContext)
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('')
  const started = useRef(false)

  useSEO({
    title: 'Verify your email | RedeemKart',
    description: 'Confirm your email address for your RedeemKart account.',
    noindex: true,
  })

  useEffect(() => {
    // A link works once, so never send the token twice (React runs effects twice in development)
    if (started.current) return
    started.current = true

    if (!token) {
      setStatus('error')
      setMessage('This verification link is not valid.')
      return
    }

    axios.post(`${BACKEND_URL}/api/auth/verify-email`, { token })
      .then(() => {
        setStatus('success')
        checkAuthStatus()
      })
      .catch((err) => {
        setStatus('error')
        setMessage(err.response?.data?.message || 'We could not verify your email. Please try again.')
      })
  }, [BACKEND_URL, token, checkAuthStatus])

  // An already used link is fine if this account is verified
  const verified = status === 'success' || (status === 'error' && user?.isEmailVerified)

  return (
    <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-4 py-12 font-['Inter',sans-serif]">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto" />
            <h1 className="font-['Poppins',sans-serif] text-xl font-semibold text-slate-900 mt-4">Verifying your email...</h1>
            <p className="text-sm text-slate-500 mt-1.5">This only takes a moment.</p>
          </>
        )}

        {status !== 'loading' && verified && (
          <>
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
            <h1 className="font-['Poppins',sans-serif] text-xl font-semibold text-slate-900 mt-4">Email verified</h1>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
              Thank you! Your email is confirmed and your account can now receive payouts for the gift cards you sell.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 mt-6">
              <Link to="/sell-gift-card" className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
                Sell a gift card
              </Link>
              <Link to={isAuthenticated ? '/' : '/login'} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2.5 rounded-xl transition-colors">
                {isAuthenticated ? 'Go to home' : 'Log in'}
              </Link>
            </div>
          </>
        )}

        {status === 'error' && !verified && (
          <>
            <XCircle className="w-14 h-14 text-red-500 mx-auto" />
            <h1 className="font-['Poppins',sans-serif] text-xl font-semibold text-slate-900 mt-4">Link not valid</h1>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{message}</p>

            {isAuthenticated ? (
              <VerifyEmailBanner className="mt-6 text-left" />
            ) : (
              <p className="text-sm text-slate-500 mt-4">Log in to your account to get a new verification email.</p>
            )}

            <Link to={isAuthenticated ? '/' : '/login'} className="inline-block mt-6 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
              {isAuthenticated ? 'Go to home' : 'Log in'} &rarr;
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail
