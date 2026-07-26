import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Gift, Trash2, Search, User, Copy, RefreshCcw, Check } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

const UserSelling = () => {
  const [userListings, setUserListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${BACKEND_URL}/api/admin/gift-cards`, { withCredentials: true })
      if (res.data.success) {
        setUserListings(res.data.data.filter(l => l.listedBy === 'user' || !l.listedBy))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDeleteUserListing = async (id) => {
    if (!window.confirm('Delete this user listing?')) return
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/gift-cards/${id}`, { withCredentials: true })
      toast.info('Listing deleted')
      fetchData()
    } catch (err) {
      toast.error('Failed to delete')
    }
  }

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this listing?')) return
    try {
      await axios.patch(`${BACKEND_URL}/api/admin/gift-cards/${id}/status`, { status: 'active' }, { withCredentials: true })
      toast.success('Listing approved')
      fetchData()
    } catch (err) {
      toast.error('Failed to approve')
    }
  }

  const handleMarkActive = async (id) => {
    if (!window.confirm('Change status to active?')) return
    try {
      await axios.patch(`${BACKEND_URL}/api/admin/gift-cards/${id}/status`, { status: 'active' }, { withCredentials: true })
      toast.success('Status changed to active')
      fetchData()
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const filteredUserListings = userListings.filter(c =>
    (c.brand || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.code || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.user?.fullName || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">User Selling List</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-gray-800">
            User-Submitted Selling List
            {!loading && <span className="ml-2 text-sm font-normal text-gray-500">({userListings.length} total)</span>}
          </h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search codes, brands..." className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-white border-b text-gray-500 font-semibold uppercase text-xs tracking-wider">
                  <th className="px-6 py-4">Brand / Value</th>
                  <th className="px-6 py-4">Code / PIN</th>
                  <th className="px-6 py-4">Seller</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUserListings.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                    <Gift className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    No user-submitted listings found.
                  </td></tr>
                ) : filteredUserListings.map(card => (
                  <tr key={card._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-800 block">{card.brand}</span>
                      <span className="text-emerald-600 font-semibold text-xs">₹{card.balance}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span className="bg-gray-100 px-2 py-1 rounded">{card.code}</span>
                        <button onClick={() => { navigator.clipboard.writeText(card.code); toast.success('Copied!') }}><Copy className="w-3 h-3 text-gray-400" /></button>
                      </div>
                      {card.pin && <div className="mt-1 text-gray-400">PIN: {card.pin}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="block font-medium text-gray-800">{card.user?.fullName || 'Unknown'}</span>
                      <span className="block text-xs text-gray-400">{card.user?.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase ${
                        card.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        card.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                        card.status === 'sold' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                      }`}>{card.status}</span>
                      {card.status === 'sold' && card.soldTo && (
                        <span className="block text-[10px] text-gray-500 mt-1">Buyer: {card.soldTo.fullName} ({card.soldTo.email})</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{new Date(card.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {card.status === 'pending' && (
                          <button onClick={() => handleApprove(card._id)} className="text-emerald-500 hover:bg-emerald-50 p-1.5 rounded" title="Approve">
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {card.status === 'sold' && (
                          <button onClick={() => handleMarkActive(card._id)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded" title="Mark Active">
                            <RefreshCcw className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => handleDeleteUserListing(card._id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserSelling
