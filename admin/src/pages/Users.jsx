import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Users as UsersIcon, Search, ToggleLeft, ToggleRight, Activity, ExternalLink, Trash2, ChevronLeft, ChevronRight, Landmark, X, Copy } from 'lucide-react'

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
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [selectedUser, setSelectedUser] = useState(null)
  const limit = 40

  const fetchUsers = async (pageNum = page) => {
    try {
      const params = { page: pageNum, limit }
      if (search.trim()) params.search = search.trim()
      const res = await axios.get(`${BACKEND_URL}/api/admin/users`, { params, withCredentials: true })
      if (res.data.success) {
        setUsers(res.data.data.users)
        setPage(res.data.data.pagination.currentPage)
        setTotalPages(res.data.data.pagination.totalPages)
        setTotalUsers(res.data.data.pagination.totalUsers)
      }
    } catch {
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers(1) }, [])

  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); fetchUsers(1) }, 400)
    return () => clearTimeout(timer)
  }, [search])

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return
    setPage(p)
    setLoading(true)
    fetchUsers(p)
  }

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
        let targetUrl = res.data.data?.frontendUrl || 'https://redeemkart.in'
        if (targetUrl.includes('gchub.in')) {
          targetUrl = targetUrl.replace('gchub.in', 'redeemkart.in')
        }
        window.open(targetUrl, '_blank')
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
        <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">{totalUsers} user{totalUsers !== 1 ? 's' : ''}</span>
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
                    <td className="px-4 py-3 text-gray-500">{(page - 1) * limit + idx + 1}</td>
                                        <td className="px-4 py-3 font-medium text-gray-900">
                      {user.fullName || user.firstName + ' ' + (user.lastName || '')}
                      {(user.bankAccountHolder || user.bankAccountNumber || user.bankName || user.ifscCode || user.upiId) && (
                        <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Landmark className="h-3 w-3" /> Bank
                        </span>
                      )}
                    </td>
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
                          onClick={() => setSelectedUser(user)}
                          className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 transition-colors"
                          title="View bank details"
                        >
                          <Landmark className="h-4 w-4" />
                        </button>
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

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, i, arr) => (
                  <span key={p} className="flex items-center">
                    {i > 0 && arr[i - 1] !== p - 1 && <span className="px-1 text-gray-400">...</span>}
                    <button
                      onClick={() => goToPage(p)}
                      className={`min-w-[32px] h-8 rounded-lg text-sm font-medium transition-colors ${
                        p === page
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bank Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setSelectedUser(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-emerald-600" />
                Bank / Payout Details
              </h3>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 pb-4 border-b border-gray-100">
              <p className="font-semibold text-gray-900">{selectedUser.fullName || selectedUser.email}</p>
              <p className="text-xs text-gray-400">{selectedUser.email} {selectedUser.phone ? `• ${selectedUser.phone}` : ''}</p>
            </div>

            {selectedUser.bankAccountHolder || selectedUser.bankAccountNumber || selectedUser.bankName || selectedUser.ifscCode || selectedUser.upiId ? (
              <div className="space-y-3">
                {[
                  { label: 'Account Holder', value: selectedUser.bankAccountHolder },
                  { label: 'Bank Account Number', value: selectedUser.bankAccountNumber },
                  { label: 'Bank Name', value: selectedUser.bankName },
                  { label: 'IFSC Code', value: selectedUser.ifscCode },
                  { label: 'UPI ID', value: selectedUser.upiId }
                ].map(item => (
                  item.value && (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{item.label}</span>
                      <span className="text-sm font-semibold text-gray-900 font-mono flex items-center gap-2">
                        {item.value}
                        <button
                          onClick={() => { navigator.clipboard.writeText(item.value); toast.success(`${item.label} copied!`) }}
                          className="text-gray-400 hover:text-gray-600"
                          title={`Copy ${item.label}`}
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    </div>
                  )
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">No payout details added yet.</p>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users
