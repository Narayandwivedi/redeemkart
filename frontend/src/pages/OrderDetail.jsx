import React, { useState, useContext, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { ArrowLeft, Package, MapPin, Phone, Mail, Calendar, CreditCard, Truck, CheckCircle, Clock, AlertCircle, XCircle, Key, Copy } from 'lucide-react'

const OrderDetail = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { BACKEND_URL, user } = useContext(AppContext)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copiedField, setCopiedField] = useState(null)

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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDateOnly = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-violet-100 text-violet-900 border-violet-200'
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'processing': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'confirmed': return <CheckCircle className="w-4 h-4" />
      case 'processing': return <Package className="w-4 h-4" />
      case 'shipped': return <Truck className="w-4 h-4" />
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    toast.success(`${field} copied!`)
    setTimeout(() => setCopiedField(null), 2000)
  }

  // Shorten order ID for display: first 8 chars uppercased
  const shortOrderId = (id) => id ? id.slice(0, 8).toUpperCase() : ''

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-violet-100 text-violet-900'
      case 'paid': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  useEffect(() => {
    fetchOrderDetail()
  }, [orderId])

  const fetchOrderDetail = async () => {
    try {
      if (!user?.email || !orderId) {
        setLoading(false)
        return
      }

      const response = await fetch(`${BACKEND_URL}/api/orders/detail/${orderId}`, {
        credentials: 'include'
      })

      const result = await response.json()

      if (result.success) {
        // Verify this order belongs to the current user
        if (result.data.customerInfo.email === user.email) {
          setOrder(result.data)
        } else {
          toast.error('Access denied: This order does not belong to you')
          navigate('/my-orders')
        }
      } else {
        throw new Error(result.message || 'Failed to fetch order details')
      }
    } catch (error) {
      console.error('Error fetching order details:', error)
      toast.error('Failed to load order details')
      navigate('/my-orders')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm">Loading order details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <Package className="w-14 h-14 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Order not found</h2>
            <p className="text-gray-500 text-sm mb-8">The order you're looking for doesn't exist or you don't have access to it.</p>
            <button
              onClick={() => navigate('/my-orders')}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-sm"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        {/* Header */}
        <div className="mb-5 sm:mb-8">
          <button
            onClick={() => navigate('/my-orders')}
            className="flex items-center text-cyan-600 hover:text-cyan-700 mb-4 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Orders
          </button>
          {/* Order title Ã¢â‚¬â€ mobile friendly, no overflow */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base font-semibold text-gray-900 leading-tight">Order</h1>
                <span className="text-xs font-mono font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                  #{shortOrderId(order._id)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Placed on {formatDate(order.orderDate)}</p>
            </div>
            <div className="flex-shrink-0">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="capitalize">{order.status}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Gift Card Redeem Codes Ã¢â‚¬â€ shown FIRST on mobile for quick access */}
            {order.giftCodes && order.giftCodes.length > 0 && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-sm border-2 border-emerald-300 overflow-hidden">
                <div className="px-4 py-4 sm:px-6 border-b border-emerald-200">
                  <h2 className="text-base font-medium text-emerald-800 flex items-center gap-2">
                    <Key className="w-4 h-4 flex-shrink-0" />
                    Your Redeem Code{order.giftCodes.length > 1 ? 's' : ''}
                  </h2>
                  <p className="text-xs text-emerald-600 mt-0.5">Use this code to redeem your gift card</p>
                </div>
                <div className="px-4 py-4 sm:px-6 space-y-4">
                  {order.giftCodes.map((gc, i) => (
                    <div key={i} className="bg-white rounded-xl border border-emerald-200 p-4 shadow-sm">
                      {/* Card header */}
                      <div className="flex items-start justify-between gap-2 mb-4">
                        <span className="font-medium text-gray-800 text-sm leading-tight">
                          {gc.brand} — ₹{gc.balance} Gift Card
                        </span>
                        <span className="flex-shrink-0 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                          Ready to Use
                        </span>
                      </div>

                      {/* Redeem Code */}
                      <div className="mb-3">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">
                          Redeem Code
                        </label>
                        <div className="flex gap-2">
                          {/* Scrollable code box Ã¢â‚¬â€ never overflows on any screen */}
                          <div className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 overflow-x-auto">
                            <p className="font-mono text-sm font-semibold text-gray-900 tracking-widest whitespace-nowrap select-all">
                              {gc.code}
                            </p>
                          </div>
                          <button
                            onClick={() => handleCopy(gc.code, 'Code')}
                            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-white text-xs font-medium transition-all duration-200 ${
                              copiedField === 'Code'
                                ? 'bg-emerald-500'
                                : 'bg-emerald-600 hover:bg-emerald-700'
                            }`}
                            title="Copy code"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{copiedField === 'Code' ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      {/* PIN */}
                      {gc.pin && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1.5">
                            PIN
                          </label>
                          <div className="flex gap-2">
                            <div className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 overflow-x-auto">
                              <p className="font-mono text-sm font-semibold text-gray-900 tracking-widest whitespace-nowrap select-all">
                                {gc.pin}
                              </p>
                            </div>
                            <button
                              onClick={() => handleCopy(gc.pin, 'PIN')}
                              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-white text-xs font-medium transition-all duration-200 ${
                                copiedField === 'PIN'
                                  ? 'bg-emerald-500'
                                  : 'bg-emerald-600 hover:bg-emerald-700'
                              }`}
                              title="Copy PIN"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>{copiedField === 'PIN' ? 'Copied!' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="text-xs text-emerald-700 bg-emerald-100 rounded-lg p-3 leading-relaxed">
                    💡 <strong>How to redeem:</strong> Go to your Google Play / respective store, tap &quot;Redeem code&quot; and enter the code above.
                  </div>
                  <p className="text-xs font-medium text-emerald-800 text-center pt-2 border-t border-emerald-200/50">
                    Your code has been sent to your email. You can also find it here anytime.
                  </p>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-4 sm:px-6 border-b border-gray-200">
                <h2 className="text-base font-medium text-gray-900 flex items-center gap-2">
                  <Package className="w-4 h-4 flex-shrink-0" />
                  Order Items ({order.totalItems} {order.totalItems === 1 ? 'item' : 'items'})
                </h2>
              </div>
              <div className="px-4 py-4 sm:px-6">
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg overflow-hidden border border-gray-200">
                        {item.productImage ? (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-center object-cover"
                            onError={(e) => { e.target.src = '/placeholder-image.jpg' }}
                          />
                        ) : item.productId?.images && item.productId.images.length > 0 ? (
                          <img
                            src={item.productId.images[0]}
                            alt={item.productName}
                            className="w-full h-full object-center object-cover"
                            onError={(e) => { e.target.src = '/placeholder-image.jpg' }}
                          />
                        ) : item.productId?.imageUrl ? (
                          <img
                            src={item.productId.imageUrl}
                            alt={item.productName}
                            className="w-full h-full object-center object-cover"
                            onError={(e) => { e.target.src = '/placeholder-image.jpg' }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm leading-tight">{item.productName}</h3>
                        <p className="text-xs text-gray-500 mt-0.5 mb-2">{item.productBrand}</p>
                        <div className="flex items-end justify-between gap-2">
                          <span className="text-xs text-gray-600">
                            Qty: <span className="font-medium">{item.quantity}</span>
                          </span>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 text-sm">{formatPrice(item.subtotal)}</p>
                            <div className="flex items-baseline justify-end gap-1">
                              <p className="text-xs text-gray-500">{formatPrice(item.productPrice)} each</p>
                              {item.originalPrice && item.originalPrice > item.productPrice && (
                                <p className="text-xs text-gray-400 line-through">{formatPrice(item.originalPrice)}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-4 sm:px-6 border-b border-gray-200">
                <h2 className="text-base font-medium text-gray-900 flex items-center gap-2">
                  <Truck className="w-4 h-4 flex-shrink-0" />
                  Delivery Information
                </h2>
              </div>
              <div className="px-4 py-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      Delivery Address
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm">
                      <p className="text-gray-900 font-medium">{order.customerInfo.name}</p>
                      <p className="text-gray-700 mt-1">{order.shippingAddress.fullAddress}</p>
                      {order.shippingAddress.city && (
                        <p className="text-gray-700">
                          {order.shippingAddress.city}
                          {order.shippingAddress.state && `, ${order.shippingAddress.state}`}
                          {order.shippingAddress.pincode && ` - ${order.shippingAddress.pincode}`}
                        </p>
                      )}
                      <div className="mt-2 pt-2 border-t border-gray-200 space-y-1">
                        <p className="text-gray-600 text-xs flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5" />
                          {order.customerInfo.phone}
                        </p>
                        <p className="text-gray-600 text-xs flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" />
                          {order.customerInfo.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      Delivery Timeline
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                        <span className="text-gray-600">Order Placed</span>
                        <span className="font-medium text-gray-900">{formatDateOnly(order.orderDate)}</span>
                      </div>
                      {order.estimatedDelivery && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                          <span className="text-gray-600">
                            {order.status === 'delivered' ? 'Delivered' : 'Expected Delivery'}
                          </span>
                          <span className="font-medium text-gray-900">
                            {order.status === 'delivered' && order.deliveryDate
                              ? formatDateOnly(order.deliveryDate)
                              : formatDateOnly(order.estimatedDelivery)
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Notes */}
            {order.customerNotes && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-4 sm:px-6 border-b border-gray-200">
                  <h2 className="text-base font-medium text-gray-900">Order Notes</h2>
                </div>
                <div className="px-4 py-4 sm:px-6">
                  <p className="text-gray-700 text-sm bg-gray-50 rounded-lg p-3">{order.customerNotes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-4 sm:px-5 border-b border-gray-200">
                <h2 className="text-base font-medium text-gray-900">Order Summary</h2>
              </div>
              <div className="px-4 py-4 sm:px-5">
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({order.totalItems} items)</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2.5">
                    <div className="flex justify-between font-semibold text-gray-900">
                      <span>Total</span>
                      <span>{formatPrice(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-4 sm:px-5 border-b border-gray-200">
                <h2 className="text-base font-medium text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 flex-shrink-0" />
                  Payment Information
                </h2>
              </div>
              <div className="px-4 py-4 sm:px-5">
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium text-gray-900 capitalize">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Status</span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="font-medium text-gray-900">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-4 sm:px-5">
                <h2 className="text-base font-medium text-gray-900 mb-3">Need Help?</h2>
                <div className="space-y-2.5">
                  <button
                    onClick={() => navigate('/chat')}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm"
                  >
                    Contact Support
                  </button>
                  {order.status === 'pending' && (
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm">
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail