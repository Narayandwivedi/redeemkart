import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Users as UsersIcon, Search, ToggleLeft, ToggleRight, Activity, ExternalLink, Trash2 } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

function formatExactDateTime(date) {
  if (!date) return 'Never'
  const d = new Date(date)
  
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  
  let hours = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  
  return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`
}

const Users = () => {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      const params = {}
      if (search.trim()) params.search = search.trim()
      const res = await axios.get(`${BACKEND_URL}/api/admin/users`, { params, withCredentials: true })
      if (res.data.success) setUsers(res.data.data.users)
    } catch {
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 400)
    return () => clearTimeout(timer)
  }, [search])

  const handleToggleStatus = async (user) => {
    try {
      const res = await axios.patch(`${BACKEND_URL}/api/admin/users/${user._id}/toggle-status`, {}, { withCredentials: true })
      if (res.data.success) {
        setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, isActive: !u.isActive } : u)))
        toast.success(res.data.message)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle status')
    }
  }

  const handleAccess = async (user) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/admin/users/${user._id}/impersonate`, {}, { withCredentials: true })
      if (res.data.success) {
        toast.success(res.data.message)
        window.open(res.data.data.frontendUrl, '_blank')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to access account')
    }
  }

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to delete ${user.fullName || user.email}? This will deactivate their account.`)) return
    try {
      const res = await axios.delete(`${BACKEND_URL}/api/admin/users/${user._id}`, { withCredentials: true })
      if (res.data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== user._id))
        toast.success(res.data.message)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">{users.length} users</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-100">
          <div className="flex items-center gap-1 px-4 pt-3">
            <div className="relative ml-auto mb-1 w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or phone..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-semibold text-gray-600">#</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Name</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Mobile Number</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Email</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Role</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Last Activity</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Joined</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-400">Loading...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-400">
                    <UsersIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No users found</p>
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{user.fullName || user.firstName + ' ' + (user.lastName || '')}</td>
                    <td className="px-4 py-3 text-gray-700">{user.phone || '-'}</td>
                    <td className="px-4 py-3 text-gray-700">{user.email || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        user.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5" title={user.lastActivity ? new Date(user.lastActivity).toLocaleString('en-IN') : ''}>
                        <Activity className="h-3.5 w-3.5 text-gray-400" />
                        <span className={`text-xs ${user.lastActivity ? 'text-gray-600 font-medium' : 'text-gray-400'}`}>
                          {formatExactDateTime(user.lastActivity)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleAccess(user)}
                          className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                          title="Access account"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            user.isActive ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'
                          }`}
                          title={user.isActive ? 'Deactivate user' : 'Activate user'}
                        >
                          {user.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Users
