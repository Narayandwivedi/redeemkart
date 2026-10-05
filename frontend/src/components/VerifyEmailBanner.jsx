import React, { useContext, useState } from 'react'
import axios from 'axios'
import { MailWarning, MailCheck } from 'lucide-react'
import { AppContext } from '../context/AppContext'

// Reminder for logged-in users who have not clicked the link in their verification email.
// The account works without it; a verified email is only required to receive payouts.
const VerifyEmailBanner = ({ className = '' }) => {
  const { user, isAuthenticated, BACKEND_URL, checkAuthStatus } = useContext(AppContext)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  if (!isAuthenticated || !user || user.isEmailVerified) return null

  const resend = async () => {
    setSending(true)
    setError('')
    try {
      const res = await axios.post(`${BACKEND_URL}/api/auth/resend-verification`, {}, { withCredentials: true })
      if (res.data.alreadyVerified) {
        checkAuthStatus()
      } else {
        setSent(true)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send the email. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 ${className}`}>
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <span className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          {sent ? <MailCheck className="w-[18px] h-[18px]" /> : <MailWarning className="w-[18px] h-[18px]" />}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-amber-900">Verify your email to receive payouts</p>
          <p className="text-[13px] text-amber-800 mt-0.5 leading-snug break-words">
            {sent
              ? `We sent a verification link to ${user.email}. Open the email and tap "Verify my email". Check your spam folder too.`
              : `You can list gift cards now, but payouts are released only after you verify ${user.email}.`}
          </p>
          {error && <p className="text-[13px] text-red-700 mt-1">{error}</p>}
        </div>
      </div>
      <button
        type="button"
        onClick={resend}
        disabled={sending}
        className="shrink-0 self-start sm:self-center bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {sending ? 'Sending...' : sent ? 'Send again' : 'Send verification email'}
      </button>
    </div>
  )
}

export default VerifyEmailBanner
