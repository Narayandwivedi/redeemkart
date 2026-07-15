import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { 
  ShoppingBag, 
  Calendar, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Package, 
  Loader2,
  ExternalLink
} from 'lucide-react'

const MyOrders = () => {
  const navigate = useNavigate()
  const { BACKEND_URL, user } = useContext(AppContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'confirmed': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'processing': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'shipped': return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      case 'delivered': return 'bg-green-50 text-green-700 border-green-200'
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-amber-500" />
      case 'confirmed': return <CheckCircle2 className="w-4 h-4 text-yellow-500" />
      case 'processing': return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
      case 'shipped': return <Package className="w-4 h-4 text-indigo-500" />
      case 'delivered': return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />
      default: return <AlertCircle className="w-4 h-4 text-slate-500" />
    }
  }

  const handleOrderClick = (orderId) => {
    navigate(`/order/${orderId}`)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      if (!user?.email) {
        setLoading(false)
        return
      }

      const response = await fetch(`${BACKEND_URL}/api/orders/customer/${user.email}`, {
        credentials: 'include'
      })

      const result = await response.json()

      if (result.success) {
        setOrders(result.data || [])
      } else {
        throw new Error(result.message || 'Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-yellow-50/20 py-16 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
        <p className="text-slate-600 font-medium animate-pulse">Loading your order history...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-yellow-50/20 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Orders</h1>
          <p className="text-slate-500 text-sm mt-1">Track details, statuses, and history of all your digital voucher purchases.</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm px-6 max-w-lg mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-amber-50 rounded-2xl flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-xl font-semibold text-slate-950 mb-2">No orders placed yet</h2>
            <p className="text-slate-500 mb-8 text-sm max-w-xs mx-auto">
              When you purchase vouchers, game topups, or gift cards, they will appear here.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold py-3 px-8 rounded-xl hover:shadow-lg hover:shadow-amber-300/40 transition-all duration-200 active:scale-[0.98]"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order._id} 
                className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                {/* Order Meta Header */}
                <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Order ID</p>
                      <p className="text-sm font-semibold text-slate-800 font-mono">#{order._id.toUpperCase()}</p>
                    </div>
                    <span className="hidden md:inline h-6 w-px bg-slate-200" />
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Date Placed</p>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(order.orderDate)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total amount</p>
                      <p className="text-base font-bold text-slate-900">{formatPrice(order.totalAmount)}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span>{order.status}</span>
                    </span>
                  </div>
                </div>

                {/* Items list */}
                <div className="px-6 py-5 divide-y divide-slate-100">
                  {order.items.map((item, index) => (
                    <div key={index} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                      {/* Product Image */}
                      <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                        {item.productImage ? (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/placeholder-image.jpg'
                            }}
                          />
                        ) : item.productId?.images && item.productId.images.length > 0 ? (
                          <img
                            src={item.productId.images[0]}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/placeholder-image.jpg'
                            }}
                          />
                        ) : item.productId?.imageUrl ? (
                          <img
                            src={item.productId.imageUrl}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/placeholder-image.jpg'
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-slate-300" />
                          </div>
                        )}
                      </div>

                      {/* Product Name & Brand */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 text-sm truncate">{item.productName}</h4>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-xs text-slate-500">
                          <span className="font-medium text-purple-600 uppercase tracking-wider text-[10px]">
                            {item.productBrand}
                          </span>
                          <span>·</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>

                      {/* Prices */}
                      <div className="text-right shrink-0">
                        <p className="font-bold text-slate-900 text-sm">{formatPrice(item.subtotal)}</p>
                        <div className="flex items-baseline justify-end gap-1.5">
                          <p className="text-[10px] text-slate-500 font-medium">{formatPrice(item.productPrice)} each</p>
                          {item.originalPrice && item.originalPrice > item.productPrice && (
                            <p className="text-[9px] text-slate-400 line-through">{formatPrice(item.originalPrice)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer details & button */}
                <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    {order.estimatedDelivery && (
                      <div className="flex items-center text-xs font-medium text-slate-500 gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {order.status === 'delivered'
                            ? `Delivered on ${formatDate(order.deliveryDate)}`
                            : `Estimated delivery: ${formatDate(order.estimatedDelivery)}`
                          }
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleOrderClick(order._id)}
                    className="w-full sm:w-auto bg-slate-950 hover:bg-slate-800 text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-200 text-xs flex items-center justify-center gap-2 cursor-pointer border border-transparent shadow hover:shadow-md active:scale-95 shrink-0"
                  >
                    <span>View Order Details</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders