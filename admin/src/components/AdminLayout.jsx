import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Gift, Users, Package, ShieldCheck, MessageSquare, Menu, X, LogOut, User, Wifi, WifiOff } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Gift Cards', icon: Gift, path: '/gift-cards' },
  { label: 'User Selling', icon: User, path: '/user-selling' },
  { label: 'Users', icon: Users, path: '/users' },
  { label: 'KYC Verifications', icon: ShieldCheck, path: '/kyc-verifications' },
  { label: 'Orders', icon: Package, path: '/orders' },
  { label: 'AI Chats', icon: MessageSquare, path: '/ai-chats' },
]

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const [siteUnreachable, setSiteUnreachable] = useState(null) // null = loading
  const [togglingSite, setTogglingSite] = useState(false)

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/site-settings/admin`, { withCredentials: true })
      .then((res) => setSiteUnreachable(Boolean(res.data?.data?.siteUnreachable)))
      .catch(() => toast.error('Failed to load user site status'))
  }, [])

  const handleToggleSiteUnreachable = async () => {
    const enabled = !siteUnreachable
    if (enabled && !window.confirm('Show "This site can\'t be reached" to ALL logged-in users on the main site?')) return
    setTogglingSite(true)
    try {
      const res = await axios.patch(`${BACKEND_URL}/api/site-settings/admin/unreachable`, { enabled }, { withCredentials: true })
      if (res.data.success) {
        setSiteUnreachable(res.data.data.siteUnreachable)
        toast.success(res.data.message)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user site status')
    } finally {
      setTogglingSite(false)
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true })
      toast.success('Logged out successfully')
      navigate('/login')
    } catch {
      toast.error('Logout failed')
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          <h1 className="text-lg font-bold">RedeemKart Admin</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-4 px-3 space-y-1 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout button at bottom of sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-red-600/20 transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600 hover:text-gray-900">
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Shows logged-in users a "This site can't be reached" page on the main site */}
            <button
              onClick={handleToggleSiteUnreachable}
              disabled={siteUnreachable === null || togglingSite}
              title={siteUnreachable ? 'Logged-in users currently see "This site can\'t be reached". Click to restore the site.' : 'Show logged-in users "This site can\'t be reached"'}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                siteUnreachable
                  ? 'bg-red-600 text-white border-red-600 hover:bg-red-700'
                  : 'text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {siteUnreachable ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
              <span className="hidden sm:inline">{siteUnreachable ? 'User site: Not reachable' : 'User site: Live'}</span>
            </button>
            {/* Logout button in header for desktop */}
            <button
              onClick={handleLogout}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
