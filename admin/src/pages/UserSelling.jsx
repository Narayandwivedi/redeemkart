import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Gift, Trash2, Search, User, Copy, RefreshCcw, Check, Banknote, X, Loader, CheckCheck, Tag, Percent, Edit3 } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

const UserSelling = () => {
  const [userListings, setUserListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Mark Paid modal state
  const [markPaidFor, setMarkPaidFor] = useState(null)
  const [markPaidDate, setMarkPaidDate] = useState('')
  const [markPaidLoading, setMarkPaidLoading] = useState(false)

  // Approval / Edit Rate modal state
  const [approveModalCard, setApproveModalCard] = useState(null)
  const [approveMode, setApproveMode] = useState('percent') // 'percent' or 'amount'
  const [approveDiscountPercent, setApproveDiscountPercent] = useState(10)
  const [approveSellingPrice, setApproveSellingPrice] = useState(0)
  const [approveLoading, setApproveLoading] = useState(false)

  const todayISO = () => new Date().toISOString().split('T')[0]

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

  const openApproveModal = (card) => {
    setApproveModalCard(card)
    setApproveMode('percent')
    const disc = card.discountPercent !== undefined ? card.discountPercent : 10
    const price = card.sellingPrice ? card.sellingPrice : Math.round(card.balance * (1 - disc / 100))
    setApproveDiscountPercent(disc)
    setApproveSellingPrice(price)
  }

  const handlePercentChange = (val) => {
    setApproveDiscountPercent(val)
    if (!approveModalCard) return
    const p = parseFloat(val) || 0
    const calcPrice = Math.max(0, Math.round(approveModalCard.balance * (1 - p / 100)))
    setApproveSellingPrice(calcPrice)
  }

  const handlePriceChange = (val) => {
    setApproveSellingPrice(val)
    if (!approveModalCard || approveModalCard.balance <= 0) return
    const pr = parseFloat(val) || 0
    const calcDisc = Math.round(((approveModalCard.balance - pr) / approveModalCard.balance) * 100 * 10) / 10
    setApproveDiscountPercent(calcDisc)
  }

  const handleConfirmApprove = async () => {
    if (!approveModalCard) return
    setApproveLoading(true)
    const isPending = approveModalCard.status === 'pending'
    const targetStatus = isPending ? 'active' : approveModalCard.status
    try {
      await axios.patch(`${BACKEND_URL}/api/admin/gift-cards/${approveModalCard._id}/status`, {
        status: targetStatus,
        sellingPrice: Number(approveSellingPrice),
        discountPercent: Number(approveDiscountPercent)
      }, { withCredentials: true })
      toast.success(isPending ? `Listing approved at ₹${approveSellingPrice} (${approveDiscountPercent}% OFF)` : `Selling price updated to ₹${approveSellingPrice} (${approveDiscountPercent}% OFF)`)
      setApproveModalCard(null)
      fetchData()
    } catch (err) {
      toast.error('Failed to save selling price')
    } finally {
      setApproveLoading(false)
    }
  }

  const handleReject = async (id) => {
    if (!window.confirm('Reject this listing? (invalid card)')) return
    try {
      await axios.patch(`${BACKEND_URL}/api/admin/gift-cards/${id}/status`, { status: 'rejected' }, { withCredentials: true })
      toast.success('Listing rejected')
      fetchData()
    } catch (err) {
      toast.error('Failed to reject')
    }
  }

  const handleMarkUsed = async (id) => {
    if (!window.confirm('Mark this card as already used?')) return
    try {
      await axios.patch(`${BACKEND_URL}/api/admin/gift-cards/${id}/status`, { status: 'used' }, { withCredentials: true })
      toast.success('Card marked as used')
      fetchData()
    } catch (err) {
      toast.error('Failed to mark as used')
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

  const handleMarkPaid = async () => {
    if (!markPaidFor) return
    setMarkPaidLoading(true)
    try {
      await axios.patch(`${BACKEND_URL}/api/admin/gift-cards/${markPaidFor}/status`, { status: 'paid', paidOn: markPaidDate }, { withCredentials: true })
      toast.success('Listing marked as paid')
      setMarkPaidFor(null)
      fetchData()
    } catch (err) {
      toast.error('Failed to mark as paid')
    } finally {
      setMarkPaidLoading(false)
    }
  }

  const filteredUserListings = userListings.filter(c =>
    (statusFilter === 'all' || (statusFilter === 'approved' ? c.status === 'active' : c.status === statusFilter)) &&
    ((c.brand || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.code || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.user?.fullName || '').toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">User Selling List</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex justify-between items-center gap-4">
            <h2 className="text-lg font-bold text-gray-800">
              User-Submitted Selling List
              {!loading && <span className="ml-2 text-sm font-normal text-gray-500">({userListings.length} total)</span>}
            </h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search codes, brands..." className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            {[
              { key: 'all', label: 'All' },
              { key: 'pending', label: 'Pending' },
              { key: 'approved', label: 'Approved' },
              { key: 'rejected', label: 'Rejected' },
              { key: 'used', label: 'Already Used' }
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                  statusFilter === f.key
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {f.label}
              </button>
            ))}
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
                  <th className="px-6 py-4">Selling Rate</th>
                  <th className="px-6 py-4">Code / PIN</th>
                  <th className="px-6 py-4">Seller</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUserListings.length === 0 ? (
                  <tr><td colSpan="7" className="px-6 py-10 text-center text-gray-400">
                    <Gift className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    No user-submitted listings found.
                  </td></tr>
                ) : filteredUserListings.map(card => (
                  <tr key={card._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-800 block">{card.brand}</span>
                      <span className="text-emerald-600 font-semibold text-xs">₹{card.balance}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 group">
                        {card.sellingPrice ? (
                          <div>
                            <span className="font-bold text-gray-900 text-sm">₹{card.sellingPrice}</span>
                            <span className="ml-1.5 text-xs font-semibold text-emerald-600">({card.discountPercent}% OFF)</span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-gray-600 text-xs">Default 10% OFF</span>
                            <span className="block font-medium text-xs text-gray-400">₹{Math.round(card.balance * 0.9)}</span>
                          </div>
                        )}
                        <button
                          onClick={() => openApproveModal(card)}
                          className="text-gray-400 hover:text-indigo-600 p-1 rounded transition-colors"
                          title="Edit Selling Price"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
                        card.status === 'sold' ? 'bg-blue-100 text-blue-700' :
                        card.status === 'paid' ? 'bg-green-100 text-green-700' :
                        card.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        card.status === 'used' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                      }`}>{card.status}</span>
                      {card.status === 'sold' && card.soldTo && (
                        <span className="block text-[10px] text-gray-500 mt-1">Buyer: {card.soldTo.fullName} ({card.soldTo.email})</span>
                      )}
                      {card.status === 'paid' && card.paidOn && (
                        <span className="block text-[10px] text-gray-500 mt-1">Paid on: {new Date(card.paidOn).toLocaleDateString('en-IN')}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{new Date(card.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {card.status === 'pending' ? (
                          <button onClick={() => openApproveModal(card)} className="text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded flex items-center gap-1 font-semibold text-xs border border-emerald-200" title="Approve & Set Rate">
                            <Check className="w-3.5 h-3.5" />
                            Approve
                          </button>
                        ) : (
                          <button onClick={() => openApproveModal(card)} className="text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded flex items-center gap-1 font-semibold text-xs border border-indigo-200" title="Edit Selling Price">
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit Price
                          </button>
                        )}
                        {card.status === 'sold' && (
                          <button onClick={() => handleMarkActive(card._id)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded" title="Mark Active">
                            <RefreshCcw className="w-4 h-4" />
                          </button>
                        )}
                        {['pending', 'active'].includes(card.status) && (
                          <button onClick={() => handleMarkUsed(card._id)} className="text-purple-500 hover:bg-purple-50 p-1.5 rounded" title="Already Used">
                            <CheckCheck className="w-4 h-4" />
                          </button>
                        )}
                        {['pending', 'active'].includes(card.status) && (
                          <button onClick={() => handleReject(card._id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded" title="Reject">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        {['pending', 'active', 'sold'].includes(card.status) && (
                          <button
                            onClick={() => {
                              setMarkPaidFor(card._id)
                              setMarkPaidDate(todayISO())
                            }}
                            className="text-green-500 hover:bg-green-50 p-1.5 rounded" title="Mark Paid">
                            <Banknote className="w-4 h-4" />
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

      {/* Approval & Selling Price Modal */}
      {approveModalCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-indigo-600" />
                  {approveModalCard.status === 'pending' ? 'Approve Listing & Set Rate' : 'Edit Selling Price & Rate'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {approveModalCard.brand} Voucher • Face Value: <span className="font-semibold text-gray-800">₹{approveModalCard.balance}</span>
                </p>
              </div>
              <button onClick={() => setApproveModalCard(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Seller Info */}
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200/60 text-xs flex justify-between items-center">
                <div>
                  <span className="text-gray-500">Seller: </span>
                  <span className="font-semibold text-gray-800">{approveModalCard.user?.fullName || 'User'}</span>
                  <span className="text-gray-400 block">{approveModalCard.user?.email}</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-500 block">Est. Seller Payout</span>
                  <span className="font-bold text-emerald-600 text-sm">
                    ₹{Math.round(approveModalCard.balance * (approveModalCard.brand === 'Google Play' ? 0.7 : 0.9))}
                  </span>
                </div>
              </div>

              {/* Rate Setting Mode Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Selling Rate Method
                </label>
                <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setApproveMode('percent')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      approveMode === 'percent'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Percentage Discount (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setApproveMode('amount')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      approveMode === 'amount'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Direct Amount (₹)
                  </button>
                </div>
              </div>

              {/* Input Fields */}
              {approveMode === 'percent' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Percentage (%) <span className="text-gray-400 font-normal">(Default 10%)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={approveDiscountPercent}
                      onChange={(e) => handlePercentChange(e.target.value)}
                      className="w-full pl-3 pr-8 py-2.5 border border-gray-300 rounded-xl text-base font-semibold text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">%</span>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selling Price on RedeemKart (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
                    <input
                      type="number"
                      min="0"
                      max={approveModalCard.balance}
                      value={approveSellingPrice}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-xl text-base font-semibold text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* Live Calculation Summary */}
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center text-xs text-indigo-900">
                  <span>Face Value (Balance):</span>
                  <span className="font-semibold">₹{approveModalCard.balance}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-indigo-900">
                  <span>Discount Offered:</span>
                  <span className="font-semibold text-emerald-600">{approveDiscountPercent}% OFF</span>
                </div>
                <div className="flex justify-between items-center text-xs text-indigo-900">
                  <span>Customer Saves:</span>
                  <span className="font-semibold text-emerald-600">₹{Math.max(0, approveModalCard.balance - approveSellingPrice)}</span>
                </div>
                <div className="border-t border-indigo-200/60 pt-2 flex justify-between items-center">
                  <span className="text-sm font-bold text-indigo-950">Store Selling Price:</span>
                  <span className="text-lg font-extrabold text-indigo-700">₹{approveSellingPrice}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setApproveModalCard(null)}
                disabled={approveLoading}
                className="px-4 py-2.5 text-sm font-semibold border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApprove}
                disabled={approveLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {approveLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {approveModalCard.status === 'pending' ? 'Approve & Publish Listing' : 'Save & Update Selling Price'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mark Paid modal */}
      {markPaidFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Banknote className="w-5 h-5 text-green-600" />
                Mark as Paid
              </h3>
              <button onClick={() => setMarkPaidFor(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paid On Date</label>
            <input
              type="date"
              value={markPaidDate}
              onChange={(e) => setMarkPaidDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setMarkPaidFor(null)}
                disabled={markPaidLoading}
                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkPaid}
                disabled={markPaidLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
              >
                {markPaidLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Confirm Paid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserSelling
