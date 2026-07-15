import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { AppContext } from '../context/AppContext'
import { Trash2, ShoppingBag, ArrowRight, Plus, Minus, Lock, Tag, Zap, Mail, Edit2, Check, User } from 'lucide-react'
import { toast } from 'react-toastify'

const Cart = () => {
  const { items, loading, removeFromCart, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart()
  const { isAuthenticated, BACKEND_URL, user } = useContext(AppContext)
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recipientEmail, setRecipientEmail] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [isEditingRecipient, setIsEditingRecipient] = useState(false)

  React.useEffect(() => {
    if (user && !recipientEmail && !recipientName) {
      setRecipientEmail(user.email || '')
      setRecipientName(user.fullName || '')
    }
  }, [user])

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setIsSubmitting(true)
    try {
      const orderData = {
        items: items.map(item => ({
          productId: String(item._id || item.id),
          name: item.name || item.seoTitle,
          price: item.price,
          originalPrice: item.originalPrice || item.price,
          brand: item.brand || 'Digital',
          imageUrl: item.imageUrl || (item.images && item.images[0]) || '',
          quantity: item.quantity
        })),
        customerNotes: '',
        paymentMethod: 'online',
        userId: user._id,
        // Digital product — no shipping address needed
        shippingAddress: {
          fullAddress: 'Digital Delivery',
          city: 'Digital',
          state: 'Digital',
          pincode: '000000'
        },
        recipientInfo: {
          name: recipientName || user?.fullName || 'Guest',
          email: recipientEmail || user?.email || 'guest@example.com'
        }
      }

      const response = await fetch(`${BACKEND_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(orderData)
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || 'Failed to initiate order')
      }

      const options = {
        key: result.data.razorpayKeyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: Math.round(result.data.totalAmount * 100),
        currency: 'INR',
        name: 'GCHub',
        description: 'Purchase of Digital Vouchers',
        image: '/favicon.png',
        order_id: result.data.razorpayOrderId,
        handler: async function (response) {
          try {
            setIsSubmitting(true)
            const verifyResponse = await fetch(`${BACKEND_URL}/api/orders/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: result.data.orderId
              })
            })
            const verifyResult = await verifyResponse.json()
            if (verifyResult.success) {
              toast.success('🎉 Payment successful! Order placed.')
              clearCart()
              navigate('/my-orders')
            } else {
              throw new Error(verifyResult.message || 'Payment verification failed')
            }
          } catch (verifyErr) {
            console.error('Verification error:', verifyErr)
            toast.error(verifyErr.message || 'Verification failed. Please contact support.')
          } finally {
            setIsSubmitting(false)
          }
        },
        prefill: {
          name: user?.fullName || '',
          email: user?.email || '',
          contact: user?.phone || '',
          method: 'upi'
        },
        theme: {
          color: '#f59e0b'
        },
        modal: {
          ondismiss: function () {
            toast.warning('Payment process was cancelled.')
            setIsSubmitting(false)
          }
        }
      }
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (resp) {
        toast.error(resp.error.description || 'Payment failed.')
        setIsSubmitting(false)
      })
      rzp.open()
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error(error.message || 'Failed to place order. Please try again.')
      setIsSubmitting(false)
    }
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)

  /* ── Empty State ── */
  if (!loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-yellow-50/20 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-amber-400" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Your cart is empty</h2>
          <p className="text-slate-500 mb-8 text-sm">Browse our vouchers and digital products to get started!</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold py-3 px-8 rounded-xl hover:shadow-lg hover:shadow-amber-300/40 transition-all duration-200 active:scale-[0.98]"
          >
            <ShoppingBag className="w-4 h-4" />
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  const subtotal = getTotalPrice()
  const totalItems = getTotalItems()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-yellow-50/20 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Shopping Cart</h1>
            <p className="text-slate-400 text-sm mt-0.5">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors font-medium flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear all
            </button>
          )}
        </div>

        {/* Digital delivery notice */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-6">
          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-xs font-medium text-amber-700">Digital products — instant delivery to your account after order confirmation</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── Cart Items ── */}
          <div className="lg:col-span-8 space-y-3">
            {items.map((item) => {
              const itemId = item._id || item.id
              const hasDiscount = item.originalPrice && item.originalPrice > item.price
              const discountPct = hasDiscount ? Math.round((1 - item.price / item.originalPrice) * 100) : 0

              return (
                <div
                  key={itemId}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  <div className="flex items-center gap-4 p-4">
                    {/* Product image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                      {item.images && item.images.length > 1 ? (
                        <div className="grid grid-cols-3 grid-rows-2 w-full h-full gap-px">
                          {item.images.slice(0, 6).map((src, i) => (
                            <img key={i} src={src} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                          ))}
                        </div>
                      ) : (
                        <img
                          src={item.imageUrl || (item.images && item.images[0]) || '/placeholder-image.jpg'}
                          alt={item.name || item.seoTitle || 'Product'}
                          className="w-full h-full object-cover object-center"
                          onError={(e) => { e.target.src = '/placeholder-image.jpg' }}
                        />
                      )}
                      {hasDiscount && (
                        <div className="absolute top-1 left-1 bg-amber-400 text-black text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
                          -{discountPct}%
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-800 text-sm sm:text-base leading-snug truncate">
                        {item.name || item.seoTitle || 'Product'}
                      </h3>
                      {item.category && (
                        <p className="text-xs text-slate-400 mt-0.5 capitalize">{item.category}</p>
                      )}

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mt-1.5">
                        <span className="text-base font-semibold text-slate-900">{formatPrice(item.price)}</span>
                        {hasDiscount && (
                          <span className="text-xs text-slate-400 line-through">{formatPrice(item.originalPrice)}</span>
                        )}
                      </div>

                      {/* Mobile: quantity + remove */}
                      <div className="flex items-center justify-between mt-3 sm:hidden">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(itemId, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-700 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm font-medium text-slate-800">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(itemId, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-700 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-slate-900 text-sm">{formatPrice(item.price * item.quantity)}</span>
                          <button
                            onClick={() => removeFromCart(itemId)}
                            className="text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Desktop: quantity + subtotal + remove */}
                    <div className="hidden sm:flex items-center gap-6 shrink-0">
                      {/* Quantity stepper */}
                      <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-1 border border-slate-100">
                        <button
                          onClick={() => updateQuantity(itemId, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg hover:bg-amber-100 hover:text-amber-700 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(itemId, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg hover:bg-amber-100 hover:text-amber-700 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line total */}
                      <div className="text-right w-20">
                        <p className="font-semibold text-slate-900 text-base">{formatPrice(item.price * item.quantity)}</p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-slate-400">{formatPrice(item.price)} each</p>
                        )}
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(itemId)}
                        className="text-slate-300 hover:text-red-500 transition-colors cursor-pointer p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Continue shopping */}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-amber-600 font-medium transition-colors mt-2"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* ── Order Summary ── */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-20">
              <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-500" />
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                  <span className="font-medium text-slate-800">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax</span>
                  <span className="font-medium text-slate-800">Included</span>
                </div>
              </div>

              <div className="border-t border-slate-100 mt-4 pt-4 flex justify-between items-baseline">
                <span className="font-semibold text-slate-900 text-base">Total</span>
                <span className="font-semibold text-slate-900 text-xl">{formatPrice(subtotal)}</span>
              </div>

              {/* Delivery Info */}
              <div className="mt-5 p-4 bg-amber-50/50 border border-amber-200 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-500" />
                    Delivery Details
                  </h3>
                  {!isEditingRecipient ? (
                    <button 
                      onClick={() => setIsEditingRecipient(true)}
                      className="text-xs text-amber-600 font-medium hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsEditingRecipient(false)}
                      className="text-xs text-green-600 font-medium hover:text-green-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3" /> Save
                    </button>
                  )}
                </div>
                
                {!isEditingRecipient ? (
                  <div>
                    <p className="text-xs text-slate-600 mb-1">
                      The redeem code will be sent to:
                    </p>
                    <p className="text-sm font-medium text-slate-900 truncate">{recipientEmail || user?.email}</p>
                    {recipientName && (
                      <p className="text-xs text-slate-500 truncate mt-0.5">{recipientName}</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 mt-3">
                    <div>
                      <label className="text-xs font-medium text-slate-700 mb-1 block">Recipient Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                          <User className="h-3 w-3 text-slate-400" />
                        </div>
                        <input 
                          type="text" 
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          className="w-full text-sm pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400"
                          placeholder="Name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-700 mb-1 block">Delivery Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                          <Mail className="h-3 w-3 text-slate-400" />
                        </div>
                        <input 
                          type="email" 
                          value={recipientEmail}
                          onChange={(e) => setRecipientEmail(e.target.value)}
                          className="w-full text-sm pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400"
                          placeholder="Email address"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full mt-5 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold py-3.5 px-4 rounded-xl hover:shadow-lg hover:shadow-amber-300/40 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                    Opening QR Code...
                  </>
                ) : !isAuthenticated ? (
                  <>Login to Checkout <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <>Proceed to Checkout <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <p className="text-[11px] text-slate-400 text-center mt-3 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                Secured with 256-bit SSL encryption
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Cart
