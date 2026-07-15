import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { LogIn } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ emailOrMobile: '', password: '' })
  const [loading, setLoading] = useState(false)

  // Redirect if already logged in as admin
  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/auth/me/admin`, { withCredentials: true })
      .then(res => {
        if (res.data.isLoggedIn && res.data.user?.role === 'admin') {
          navigate('/', { replace: true })
        }
      })
      .catch(() => {}) // not logged in, stay on login page
  }, [navigate])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.emailOrMobile || !form.password) {
      toast.error('Please fill all fields')
      return
    }
    setLoading(true)
    try {
      const res = await axios.post(`${BACKEND_URL}/api/auth/login`, form, { withCredentials: true })
      if (res.data.success || res.data.userData) {
        toast.success('Login successful')
        navigate('/')
      } else {
        toast.error(res.data.message || 'Login failed')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">RedeemKart Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="emailOrMobile" value={form.emailOrMobile} onChange={handleChange} placeholder="admin@example.com" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Enter password" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
            {loading ? 'Signing in...' : <><LogIn className="h-4 w-4" /> Sign In</>}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
