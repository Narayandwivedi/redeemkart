import { useEffect, useState, createContext, useMemo, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

export const AppContextProvider = (props) => {
  const navigate = useNavigate()

  // Auth states
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(null) // null = loading, true/false = auth status
  const [loading, setLoading] = useState(true)
  const [isCheckingAuth, setIsCheckingAuth] = useState(false)

  // Memoize functions to prevent re-renders
  const checkAuthStatus = useCallback(async () => {
    // Prevent multiple simultaneous auth checks
    if (isCheckingAuth) return
   
    try {
      setIsCheckingAuth(true)
      setLoading(true)
      const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
        withCredentials: true
      })
     
      if (response.data.isLoggedIn) {
        setIsAuthenticated(true)
        setUser(response.data.user)
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setLoading(false)
      setIsCheckingAuth(false)
    }
  }, [isCheckingAuth])

  // Check authentication status on app load
  useEffect(() => {
    // Only check auth if we haven't already checked
    if (isAuthenticated === null && !user && !isCheckingAuth) {
      checkAuthStatus()
    }
  }, [isAuthenticated, user, checkAuthStatus, isCheckingAuth])

  // Login function
  const login = useCallback(async (loginData) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, loginData, {
        withCredentials: true
      })
      
      if (response.data.success) {
        setIsAuthenticated(true)
        setUser(response.data.userData)
        return { success: true }
      } else {
        return { 
          success: false, 
          error: response.data.message || 'Login failed' 
        }
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    }
  }, [])

  // Signup function: sends an OTP to the email. The account is created by verifySignupOtp.
  const signup = useCallback(async (signupData) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/signup`, signupData, {
        withCredentials: true
      })

      if (response.data.success) {
        return { success: true, email: response.data.email }
      } else {
        return {
          success: false,
          error: response.data.message || 'Signup failed'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Signup failed'
      }
    }
  }, [])

  // Verify the signup email OTP; on success the account exists and the user is logged in
  const verifySignupOtp = useCallback(async (email, otp) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/signup/verify`, { email, otp }, {
        withCredentials: true
      })

      if (response.data.success) {
        setIsAuthenticated(true)
        setUser(response.data.userData)
        return { success: true }
      } else {
        return {
          success: false,
          error: response.data.message || 'Verification failed'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Verification failed'
      }
    }
  }, [])

  // Logout function
  const logout = useCallback(async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, {
        withCredentials: true
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsAuthenticated(false)
      setUser(null)
      navigate('/login')
    }
  }, [navigate])

  // Google login function
  const googleLogin = useCallback(async (credential) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/google`, {
        credential
      }, {
        withCredentials: true
      })
      
      if (response.data.success) {
        setIsAuthenticated(true)
        setUser(response.data.userData)
        return { success: true }
      } else {
        return { 
          success: false, 
          error: response.data.message || 'Google login failed' 
        }
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Google login failed' 
      }
    }
  }, [])

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    BACKEND_URL,
    user,
    setUser,
    isAuthenticated,
    loading,
    login,
    signup,
    verifySignupOtp,
    logout,
    googleLogin,
    checkAuthStatus
  }), [
    user,
    setUser,
    isAuthenticated,
    loading,
    login,
    signup,
    verifySignupOtp,
    logout,
    googleLogin,
    checkAuthStatus
  ])

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};