import React, { useState, useEffect, useContext } from 'react'
import { ArrowLeft, Gift, CheckCircle, Clock, TrendingUp, Banknote, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../context/AppContext'

const statusConfig = {
  pending: { icon: Clock, bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Pending' },
  active: { icon: Clock, bg: 'bg-violet-50 text-violet-800 border-violet-200', label: 'Active' },
  sold: { icon: CheckCircle, bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Sold' },
  expired: { icon: TrendingUp, bg: 'bg-red-50 text-red-700 border-red-200', label: 'Expired' },
}

const MySales = () => {
  const { BACKEND_URL } = useContext(AppContext)
  const [listings, setListings] = useState([])

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/gift-cards`, { withCredentials: true })
        if (res.data.success) {
          setListings(res.data.data)
        }
      } catch {
        // silently fail
      }
    }
    fetchListings()
  }, [BACKEND_URL])

  const totalEarnings = listings.filter(s => s.status === 'sold').reduce((sum, s) => sum + Math.round(s.balance * (s.brand === 'Google Play' ? 0.7 : 0.9)), 0)
  const pendingPayout = listings.filter(s => s.status === 'active' || s.status === 'pending').reduce((sum, s) => sum + Math.round(s.balance * (s.brand === 'Google Play' ? 0.7 : 0.9)), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-6">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </Link>
          <h1 className="text-lg sm:text-2xl font-semibold text-gray-900">My Sales</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 rounded-lg p-3">
                <Banknote className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Earnings</p>
                <p className="text-xl font-semibold text-gray-900">Ã¢â€šÂ¹{totalEarnings.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="bg-violet-100 rounded-lg p-3">
                <Clock className="h-6 w-6 text-violet-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Payout</p>
                <p className="text-xl font-semibold text-gray-900">Ã¢â€šÂ¹{pendingPayout.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-lg p-3">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Sales</p>
                <p className="text-xl font-semibold text-gray-900">{listings.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Sales History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-5 py-3 font-medium text-gray-600">Brand</th>
                  <th className="px-5 py-3 font-medium text-gray-600">Card Value</th>
                  <th className="px-5 py-3 font-medium text-gray-600">Commission</th>
                  <th className="px-5 py-3 font-medium text-gray-600">You Received</th>
                  <th className="px-5 py-3 font-medium text-gray-600">Listed On</th>
                  <th className="px-5 py-3 font-medium text-gray-600">Paid On</th>
                  <th className="px-5 py-3 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {listings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                      <Gift className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                      <p>No gift card listings yet</p>
                    </td>
                  </tr>
                ) : (
                  listings.map((card) => {
                    const commissionRate = card.brand === 'Google Play' ? 0.3 : 0.1
                    const commission = Math.round(card.balance * commissionRate)
                    const payout = card.balance - commission
                    const StatusIcon = statusConfig[card.status]?.icon || Clock
                    const statusStyle = statusConfig[card.status]?.bg || 'bg-gray-50 text-gray-700 border-gray-200'
                    const statusLabel = statusConfig[card.status]?.label || card.status
                    return (
                      <tr key={card._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Gift className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{card.brand}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-700">Ã¢â€šÂ¹{card.balance}</td>
                        <td className="px-5 py-4 text-gray-500">-Ã¢â€šÂ¹{commission}</td>
                        <td className="px-5 py-4 font-medium text-emerald-600">Ã¢â€šÂ¹{payout}</td>
                        <td className="px-5 py-4 text-gray-600">{new Date(card.createdAt).toLocaleDateString('en-IN')}</td>
                        <td className="px-5 py-4 text-gray-600">{card.status === 'sold' ? new Date(card.updatedAt).toLocaleDateString('en-IN') : '-'}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle}`}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {statusLabel}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MySales