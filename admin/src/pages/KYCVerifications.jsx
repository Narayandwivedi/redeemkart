import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import {
  ShieldCheck,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

const STATUS_FILTERS = [
  { id: '', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'verified', label: 'Verified' },
  { id: 'rejected', label: 'Rejected' }
]

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
  hours = hours ? hours : 12
  return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`
}

const KYCVerifications = () => {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [viewImage, setViewImage] = useState(null)
  const limit = 20

  const fetchKyc = async (pageNum = page, status = statusFilter, query = search) => {
    try {
      const params = { page: pageNum, limit }
      if (status) params.status = status
      if (query.trim()) params.search = query.trim()
      const res = await axios.get(`${BACKEND_URL}/api/admin/kyc`, { params, withCredentials: true })
      if (res.data.success) {
        setUsers(res.data.data.users)
        setPage(res.data.data.pagination.currentPage)
        setTotalPages(res.data.data.pagination.totalPages)
        setTotalUsers(res.data.data.pagination.totalUsers)
      }
    } catch {
      toast.error('Failed to fetch KYC submissions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      fetchKyc(1, statusFilter, search)
    }, 400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, search])

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return
    setPage(p)
    setLoading(true)
    fetchKyc(p, statusFilter, search)
  }

  const handleReview = async (user, action) => {
    let rejectionReason = ''
    if (action === 'reject') {
      rejectionReason = window.prompt('Please provide a reason for rejection:')
      if (rejectionReason === null) return
      if (!rejectionReason.trim()) {
        toast.error('Rejection reason is required')
        return
      }
    }

    try {
      const res = await axios.patch(
        `${BACKEND_URL}/api/admin/kyc/${user._id}`,
        { action, rejectionReason: action === 'reject' ? rejectionReason.trim() : undefined },
        { withCredentials: true }
      )
      if (res.data.success) {
        toast.success(res.data.message)
        setUsers((prev) =>
          prev.map((u) =>
            u._id === user._id
              ? { ...u, kycStatus: action === 'approve' ? 'verified' : 'rejected', kycRejectionReason: rejectionReason.trim() }
              : u
          )
        )
      } else {
        toast.error(res.data.message || 'Failed to review KYC')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to review KYC')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">KYC Verifications</h1>
        <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">{totalUsers} submission{totalUsers !== 1 ? 's' : ''}</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 pt-3 pb-2">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => { setStatusFilter(f.id); setPage(1); setLoading(true) }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    statusFilter === f.id ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="relative sm:ml-auto w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, phone..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-semibold text-gray-600">User</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Document</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Document No.</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Photo</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Submitted</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">Loading...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    <ShieldCheck className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No KYC submissions found</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{user.fullName || '-'}</p>
                      <p className="text-xs text-gray-500">{user.email || '-'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-indigo-50 text-indigo-700 border-indigo-200">
                        {user.kycDocumentLabel || user.kycDocumentType || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-700">{user.kycDocumentNumberMasked || '-'}</td>
                    <td className="px-4 py-3">
                      {user.kycDocumentImage ? (
                        <button
                          onClick={() => setViewImage(user.kycDocumentImage)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer text-xs font-medium"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{formatExactDateTime(user.kycSubmittedAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        user.kycStatus === 'verified'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : user.kycStatus === 'rejected'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {user.kycStatus === 'verified' ? 'Verified' : user.kycStatus === 'rejected' ? 'Rejected' : 'Pending'}
                      </span>
                      {user.kycStatus === 'rejected' && user.kycRejectionReason && (
                        <p className="text-[11px] text-red-500 mt-1 max-w-[160px] truncate" title={user.kycRejectionReason}>
                          {user.kycRejectionReason}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {user.kycStatus === 'pending' ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleReview(user, 'approve')}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors cursor-pointer"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReview(user, 'reject')}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                          {user.kycStatus === 'verified' ? <Clock className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                          Reviewed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 text-sm text-gray-600">{page}</span>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {viewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setViewImage(null)}>
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-lg w-full">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-gray-400" />
                Document Image
              </h3>
              <button onClick={() => setViewImage(null)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <img src={`${BACKEND_URL}${viewImage}`} alt="KYC Document" className="w-full max-h-[60vh] object-contain bg-gray-50" />
          </div>
        </div>
      )}
    </div>
  )
}

export default KYCVerifications
