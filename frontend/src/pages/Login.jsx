import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import GoogleLogin from '../components/GoogleLogin'

const Login = () => {
  const { login, signup, BACKEND_URL } = useContext(AppContext)
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [loginData, setLoginData] = useState({
    emailOrMobile: '',
    password: ''
  })

  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  })

  // Forgot password
  const [forgotStep, setForgotStep] = useState(0)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotOtp, setForgotOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const resetForgotPassword = () => {
    setForgotStep(0)
    setForgotEmail('')
    setForgotOtp('')
    setNewPassword('')
    setConfirmPassword('')
    setError('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await login(loginData)
      if (result.success) {
        navigate('/')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (!signupData.fullName.trim()) {
      setError('Full name is required')
      setLoading(false)
      return
    }
    if (!signupData.email.trim()) {
      setError('Email is required')
      setLoading(false)
      return
    }
    if (!signupData.mobile.trim()) {
      setError('Mobile number is required')
      setLoading(false)
      return
    }
    if (!signupData.password) {
      setError('Password is required')
      setLoading(false)
      return
    }
    if (!signupData.confirmPassword) {
      setError('Please confirm your password')
      setLoading(false)
      return
    }
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }
    try {
      const { confirmPassword, ...submitData } = signupData
      const result = await signup(submitData)
      if (result.success) {
        navigate('/')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/forgot-password`, {
        email: forgotEmail
      })
      if (response.data.success) {
        setForgotStep(2)
      } else {
        setError(response.data.message || 'Failed to send OTP')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/reset-password`, {
        email: forgotEmail,
        otp: forgotOtp,
        newPass: newPassword
      })
      if (response.data.success) {
        resetForgotPassword()
        setIsLogin(true)
      } else {
        setError(response.data.message || 'Password reset failed')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-[100dvh] bg-gradient-to-br from-slate-50 via-violet-50 to-violet-100 flex flex-col items-center justify-center p-4 relative overflow-hidden'>
      <div className='absolute top-0 left-0 w-full h-full overflow-hidden z-0'>
        <div className='absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-violet-300/20 rounded-full blur-3xl'></div>
        <div className='absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-violet-300/20 rounded-full blur-3xl'></div>
      </div>

      <div className='w-full max-w-md z-10'>
        <div className='bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20'>
          <div className='text-center mb-6'>
            <Link to='/' className='inline-block'>
              <img src='/redeemkart-logo.png' alt='RedeemKart' className='h-20 w-auto mx-auto object-contain' />
            </Link>
            {forgotStep === 0 ? (
              <>
                <div className='flex bg-slate-100 rounded-xl p-1 mb-4'>
                  <button
                    type='button'
                    onClick={() => { setIsLogin(true); setError('') }}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${isLogin ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Sign In
                  </button>
                  <button
                    type='button'
                    onClick={() => { setIsLogin(false); setError('') }}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${!isLogin ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Sign Up
                  </button>
                </div>
                <p className='text-slate-500 text-xs'>{isLogin ? 'Sign in to your Voucher Cash account' : 'Create your Voucher Cash account'}</p>
              </>
            ) : (
              <div className='mb-2'>
                <p className='text-slate-700 font-semibold text-sm'>
                  {forgotStep === 1 && 'Forgot Password'}
                  {forgotStep === 2 && 'Enter OTP'}
                  {forgotStep === 3 && 'Reset Password'}
                </p>
                <p className='text-slate-400 text-xs mt-1'>
                  {forgotStep === 1 && 'Enter your registered email to receive OTP'}
                  {forgotStep === 2 && `OTP sent to ${forgotEmail}`}
                  {forgotStep === 3 && 'Choose a new password for your account'}
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-xl'>
              <div className='flex items-center gap-2'>
                <svg className='w-5 h-5 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
                <p className='text-sm text-red-800 font-medium'>{error}</p>
              </div>
            </div>
          )}

          {/* forgotStep 0 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Login / Signup */}
          {forgotStep === 0 && (
            <form onSubmit={isLogin ? handleLogin : handleSignup} className='space-y-3.5'>
              {/* Login fields */}
              {isLogin && (
                <>
                  <div>
                    <label className='block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 ml-1'>Email or Mobile</label>
                    <div className='relative group'>
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-violet-600'>
                        <svg className='w-5 h-5 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                        </svg>
                      </div>
                      <input type='text' value={loginData.emailOrMobile} onChange={(e) => setLoginData({...loginData, emailOrMobile: e.target.value})} placeholder='Email or Mobile' className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all text-sm placeholder:text-slate-400 font-medium' disabled={loading} />
                    </div>
                  </div>
                  <div>
                    <label className='block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 ml-1'>Password</label>
                    <div className='relative group'>
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-violet-600'>
                        <svg className='w-5 h-5 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                        </svg>
                      </div>
                      <input type={showPassword ? 'text' : 'password'} value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} placeholder='ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢' className='w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all text-sm placeholder:text-slate-400 font-medium' disabled={loading} />
                      <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-slate-400 hover:text-slate-600 transition-colors'>
                        {showPassword ? (
                          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' />
                          </svg>
                        ) : (
                          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  {error && (
                    <div className='p-3 bg-red-50 border border-red-200 rounded-xl'>
                      <div className='flex items-center gap-2'>
                        <svg className='w-4 h-4 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        <p className='text-sm text-red-800 font-medium'>{error}</p>
                      </div>
                    </div>
                  )}
                  <div className='text-right -mt-1'>
                    <button type='button' onClick={() => setForgotStep(1)} className='text-xs font-medium text-violet-700 hover:text-violet-800 hover:underline transition-colors cursor-pointer'>
                      Forgot Password?
                    </button>
                  </div>
                </>
              )}

              {/* Signup fields */}
              {!isLogin && (
                <>
                  <div>
                    <label className='block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 ml-1'>Full Name</label>
                    <div className='relative group'>
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-violet-600'>
                        <svg className='w-5 h-5 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                        </svg>
                      </div>
                      <input type='text' value={signupData.fullName} onChange={(e) => setSignupData({...signupData, fullName: e.target.value})} placeholder='John Doe' className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all text-sm placeholder:text-slate-400 font-medium' disabled={loading} />
                    </div>
                  </div>
                  <div>
                    <label className='block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 ml-1'>Email</label>
                    <div className='relative group'>
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-violet-600'>
                        <svg className='w-5 h-5 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                        </svg>
                      </div>
                      <input type='email' value={signupData.email} onChange={(e) => setSignupData({...signupData, email: e.target.value})} placeholder='john@example.com' className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all text-sm placeholder:text-slate-400 font-medium' disabled={loading} />
                    </div>
                  </div>
                  <div>
                    <label className='block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 ml-1'>Mobile</label>
                    <div className='relative group'>
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-violet-600'>
                        <svg className='w-5 h-5 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                        </svg>
                      </div>
                      <input type='tel' value={signupData.mobile} onChange={(e) => setSignupData({...signupData, mobile: e.target.value})} placeholder='+91 9876543210' className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all text-sm placeholder:text-slate-400 font-medium' disabled={loading} />
                    </div>
                  </div>
                  <div>
                    <label className='block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 ml-1'>Password</label>
                    <div className='relative group'>
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-violet-600'>
                        <svg className='w-5 h-5 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                        </svg>
                      </div>
                      <input type={showPassword ? 'text' : 'password'} value={signupData.password} onChange={(e) => setSignupData({...signupData, password: e.target.value})} placeholder='Create a password' className='w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all text-sm placeholder:text-slate-400 font-medium' disabled={loading} />
                      <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-slate-400 hover:text-slate-600 transition-colors'>
                        {showPassword ? (
                          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' />
                          </svg>
                        ) : (
                          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className='block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 ml-1'>Confirm Password</label>
                    <div className='relative group'>
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-violet-600'>
                        <svg className='w-5 h-5 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                        </svg>
                      </div>
                      <input type={showPassword ? 'text' : 'password'} value={signupData.confirmPassword} onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})} placeholder='Re-enter password' className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all text-sm placeholder:text-slate-400 font-medium' disabled={loading} />
                    </div>
                  </div>
                  {error && (
                    <div className='p-3 bg-red-50 border border-red-200 rounded-xl'>
                      <div className='flex items-center gap-2'>
                        <svg className='w-4 h-4 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        <p className='text-sm text-red-800 font-medium'>{error}</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              <button type='submit' disabled={loading} className='w-full bg-gradient-to-r from-violet-500 to-violet-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-violet-600/30 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-2 cursor-pointer'>
                {loading ? (
                  <>
                    <svg className='animate-spin h-5 w-5 text-black' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
                    <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                  </>
                ) : (
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                )}
              </button>

              <div className='relative my-4'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-slate-200'></div>
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span className='bg-white px-2 text-slate-400 font-semibold tracking-widest'>Or continue with</span>
                </div>
              </div>

              <div className='flex justify-center'>
                <GoogleLogin />
              </div>
            </form>
          )}

          {/* forgotStep 1 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Send OTP */}
          {forgotStep === 1 && (
            <form onSubmit={handleSendOTP} className='space-y-3.5'>
              <div>
                <label className='block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 ml-1'>Email Address</label>
                <div className='relative group'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-violet-600'>
                    <svg className='w-5 h-5 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                    </svg>
                  </div>
                  <input type='email' value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder='john@example.com' className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all text-sm placeholder:text-slate-400 font-medium' disabled={loading} />
                </div>
              </div>

              {error && (
                <div className='p-3 bg-red-50 border border-red-200 rounded-xl'>
                  <div className='flex items-center gap-2'>
                    <svg className='w-4 h-4 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                    <p className='text-sm text-red-800 font-medium'>{error}</p>
                  </div>
                </div>
              )}

              <button type='submit' disabled={loading} className='w-full bg-gradient-to-r from-violet-500 to-violet-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-violet-600/30 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-2 cursor-pointer'>
                {loading ? (
                  <>
                    <svg className='animate-spin h-5 w-5 text-black' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <span>Send OTP</span>
                )}
              </button>

              <div className='text-center'>
                <button type='button' onClick={() => setForgotStep(0)} className='text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors cursor-pointer'>
                  &larr; Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* forgotStep 2 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Verify OTP */}
          {forgotStep === 2 && (
            <form onSubmit={handleResetPassword} className='space-y-3.5'>
              <div>
                <label className='block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3 ml-1'>Enter OTP</label>
                <div className='flex items-center justify-center gap-2'>
                  <input type='text' inputMode='numeric' maxLength={6} value={forgotOtp} onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder='000000' className='w-full text-center text-xl font-semibold bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all py-2.5 tracking-[0.5em]' disabled={loading} />
                </div>
              </div>

              {error && (
                <div className='p-3 bg-red-50 border border-red-200 rounded-xl'>
                  <div className='flex items-center gap-2'>
                    <svg className='w-4 h-4 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                    <p className='text-sm text-red-800 font-medium'>{error}</p>
                  </div>
                </div>
              )}

              <button type='submit' disabled={loading || forgotOtp.length !== 6} className='w-full bg-gradient-to-r from-violet-500 to-violet-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-violet-600/30 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-2 cursor-pointer'>
                {loading ? (
                  <>
                    <svg className='animate-spin h-5 w-5 text-black' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
                    <span>Verifying OTP...</span>
                  </>
                ) : (
                  <span>Verify OTP</span>
                )}
              </button>

              <div className='text-center'>
                <button type='button' onClick={() => setForgotStep(1)} className='text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors cursor-pointer'>
                  &larr; Change Email
                </button>
              </div>
            </form>
          )}

          {/* forgotStep 3 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Reset Password */}
          {forgotStep === 3 && (
            <form onSubmit={handleResetPassword} className='space-y-3.5'>
              <div>
                <label className='block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 ml-1'>New Password</label>
                <div className='relative group'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-violet-600'>
                    <svg className='w-5 h-5 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                    </svg>
                  </div>
                  <input type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder='Min. 6 characters' className='w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all text-sm placeholder:text-slate-400 font-medium' disabled={loading} />
                  <button type='button' onClick={() => setShowNewPassword(!showNewPassword)} className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-slate-400 hover:text-slate-600 transition-colors'>
                    {showNewPassword ? (
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' />
                      </svg>
                    ) : (
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className='block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 ml-1'>Confirm Password</label>
                <div className='relative group'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-violet-600'>
                    <svg className='w-5 h-5 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                    </svg>
                  </div>
                  <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Re-enter new password' className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all text-sm placeholder:text-slate-400 font-medium' disabled={loading} />
                </div>
              </div>

              {error && (
                <div className='p-3 bg-red-50 border border-red-200 rounded-xl'>
                  <div className='flex items-center gap-2'>
                    <svg className='w-4 h-4 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                    <p className='text-sm text-red-800 font-medium'>{error}</p>
                  </div>
                </div>
              )}

              <button type='submit' disabled={loading} className='w-full bg-gradient-to-r from-violet-500 to-violet-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-violet-600/30 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-2 cursor-pointer'>
                {loading ? (
                  <>
                    <svg className='animate-spin h-5 w-5 text-black' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <span>Reset Password</span>
                )}
              </button>

              <div className='text-center'>
                <button type='button' onClick={() => setForgotStep(0)} className='text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors cursor-pointer'>
                  &larr; Back to Sign In
                </button>
              </div>
            </form>
          )}

          <div className='mt-4 text-center space-y-1'>
            <p className='text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1'>
              <svg className='w-3 h-3 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
              </svg>
              Your transactions are encrypted and secure.
            </p>
            <p className='text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1'>
              <svg className='w-3 h-3 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z' />
              </svg>
              Payments processed securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
