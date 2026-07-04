import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Package, Search, ChevronLeft, ChevronRight, X } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

const statusTabs = [
  { key: '', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'processing', label: 'Processing' },
  { key: 'delivered', label: 'Delivered' },
]

const statusBadge = (status) => {
  const map = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    processing: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  }
  return map[status] || 'bg-gray-50 text-gray-700 border-gray-200'
}

const paymentBadge = (status) => {
  const map = {
    paid: 'bg-green-50 text-green-700 border-green-200',
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    failed: 'bg-red-50 text-red-700 border-red-200',
    refunded: 'bg-orange-50 text-orange-700 border-orange-200',
  }
  return map[status] || 'bg-gray-50 text-gray-700 border-gray-200'
}

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  // Assign Code Modal State
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [assignData, setAssignData] = useState({ brand: '', balance: '', code: '', pin: '', listingId: '' })
  const [assigning, setAssigning] = useState(false)
  const [activeListings, setActiveListings] = useState([])
  const [fetchingListings, setFetchingListings] = useState(false)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 15 }
      if (activeTab) params.status = activeTab
      const res = await axios.get(`${BACKEND_URL}/api/orders`, { params, withCredentials: true })
      if (res.data.success) {
        setOrders(res.data.data)
        setPagination(res.data.pagination)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [activeTab, page])

  const handleAssignSubmit = async () => {
    if (!assignData.brand || !assignData.balance || !assignData.code) {
      return toast.error('Brand, Balance, and Code are required')
    }
    setAssigning(true)
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/orders/${selectedOrder._id}/assign-code`,
        assignData,
        { withCredentials: true }
      )
      if (res.data.success) {
        toast.success('Code assigned and email sent!')
        setAssignModalOpen(false)
        fetchOrders()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign code')
    } finally {
      setAssigning(false)
    }
  }

  const filtered = search.trim()
    ? orders.filter((o) =>
        (o._id.toLowerCase().includes(search.toLowerCase())) ||
        (o.orderId?.toString().includes(search)) ||
        (o.customerInfo?.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (o.customerInfo?.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (o.customerInfo?.phone || '').includes(search)
      )
    : orders

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        {pagination && (
          <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
            {pagination.total} total
          </span>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-100">
          <div className="flex items-center gap-1 px-4 pt-3 overflow-x-auto">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setPage(1) }}
                className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-gray-900 text-gray-900 bg-gray-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <div className="relative ml-auto mb-1 w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-semibold text-gray-600">Order ID</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Customer</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Items</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Total</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Payment</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Date</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">Loading...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                    <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No orders found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-gray-800 font-medium">
                        {(order.orderId || order._id).toString().slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-gray-900 font-medium text-xs">{order.customerInfo?.name || '-'}</span>
                        <span className="text-gray-400 text-xs">{order.customerInfo?.email || ''}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{order.totalItems || order.items?.length || 0}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium">₹{order.totalAmount?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${paymentBadge(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(order.orderDate || order.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={async () => {
                          setSelectedOrder(order)
                          setAssignData({
                            brand: order.items?.[0]?.productBrand || '',
                            balance: order.items?.[0]?.productPrice || '',
                            code: '',
                            pin: '',
                            listingId: ''
                          })
                          setAssignModalOpen(true)
                          
                          // Fetch active listings for this product
                          const productId = order.items?.[0]?.productId
                          if (productId) {
                            setFetchingListings(true)
                            try {
                              const res = await axios.get(`${BACKEND_URL}/api/admin/gift-cards/product/${productId}`, { withCredentials: true })
                              if (res.data.success) {
                                setActiveListings(res.data.data.filter(l => l.status === 'active'))
                              }
                            } catch (err) {
                              console.error('Failed to fetch listings', err)
                              setActiveListings([])
                            } finally {
                              setFetchingListings(false)
                            }
                          } else {
                            setActiveListings([])
                          }
                        }}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium rounded-lg text-xs whitespace-nowrap"
                      >
                        Assign Code
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              Page {pagination.current} of {pagination.pages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page >= pagination.pages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Assign Code Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Assign Code to {selectedOrder?.customerInfo?.name || 'Customer'}
              </h2>
              <button onClick={() => setAssignModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {fetchingListings ? (
                <div className="text-sm text-gray-500 mb-2">Loading available codes...</div>
              ) : activeListings.length > 0 ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Existing Code (Optional)</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      if (!e.target.value) {
                        setAssignData(prev => ({ ...prev, code: '', pin: '', listingId: '' }))
                        return
                      }
                      const selected = activeListings.find(l => l._id === e.target.value)
                      if (selected) {
                        setAssignData(prev => ({
                          ...prev,
                          code: selected.code,
                          pin: selected.pin || '',
                          brand: selected.brand,
                          balance: selected.balance,
                          listingId: selected._id
                        }))
                      }
                    }}
                    value={assignData.listingId || ""}
                  >
                    <option value="">-- Type manual code below --</option>
                    {activeListings.map(l => (
                      <option key={l._id} value={l._id}>
                        Code: {l.code} (Bal: ₹{l.balance})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="text-sm text-amber-600 mb-4 bg-amber-50 p-2 rounded border border-amber-200">
                  No active existing codes found for this variant. Please enter manually.
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <input
                  type="text"
                  value={assignData.brand}
                  onChange={(e) => setAssignData({ ...assignData, brand: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Google Play"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Balance (Value)</label>
                <input
                  type="number"
                  value={assignData.balance}
                  onChange={(e) => setAssignData({ ...assignData, balance: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Redeem Code</label>
                <input
                  type="text"
                  value={assignData.code}
                  onChange={(e) => setAssignData({ ...assignData, code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="XXXX-XXXX-XXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PIN (Optional)</label>
                <input
                  type="text"
                  value={assignData.pin}
                  onChange={(e) => setAssignData({ ...assignData, pin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="Leave empty if none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignSubmit}
                disabled={assigning}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {assigning ? 'Assigning...' : 'Assign & Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
