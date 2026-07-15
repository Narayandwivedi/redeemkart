import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { useCart } from '../context/CartContext'
import { toast } from 'react-toastify'
import { ShoppingBag, CreditCard, Lock, Zap, ChevronLeft } from 'lucide-react'

const Checkout = () => {
  const { BACKEND_URL, user } = useContext(AppContext)
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart()
  const navigate = useNavigate()

  const [customerNotes, setCustomerNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('online')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false)

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)

  const handlePlaceOrder = async () => {
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
        customerNotes,
        paymentMethod,
        userId: user._id,
        // Digital product ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â no shipping address needed
        shippingAddress: {
          fullAddress: 'Digital Delivery',
          city: 'Digital',
          state: 'Digital',
          pincode: '000000'
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
        throw new Error(result.message || 'Failed to place order')
      }

      if (paymentMethod === 'online') {
        const options = {
          key: result.data.razorpayKeyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: Math.round(result.data.totalAmount * 100),
          currency: 'INR',
          name: 'RedeemKart',
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
                toast.success('ÃƒÂ°Ã…Â¸Ã…Â½Ã¢â‚¬Â° Payment successful! Order placed.')
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
            color: '#7c3aed'
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
      } else {
        // Cash on Delivery success path
        toast.success('ÃƒÂ°Ã…Â¸Ã…Â½Ã¢â‚¬Â° Order placed! Your voucher will be delivered soon.')
        clearCart()
        navigate('/my-orders')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error(error.message || 'Failed to place order. Please try again.')
      setIsSubmitting(false)
    }
  }

  React.useEffect(() => {
    if (items.length > 0 && !hasAutoSubmitted) {
      setHasAutoSubmitted(true)
      handlePlaceOrder()
    }
  }, [items, hasAutoSubmitted])

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto" />
          <p className="mt-4 text-gray-600">Redirecting to cart...</p>
        </div>
      </div>
    )
  }

  const subtotal = getTotalPrice()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-violet-50/20 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link to="/cart" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-4 font-medium text-sm">
            <ChevronLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900">Complete Your Order</h1>
          <p className="text-slate-500 text-sm mt-1">Digital products ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â instant delivery after payment</p>
        </div>

        {/* Digital badge */}
        <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 mb-6">
          <Zap className="w-4 h-4 text-violet-700 shrink-0" />
          <p className="text-sm font-medium text-violet-900">
            These are digital products. No shipping address required ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â you'll receive your voucher code by email / in your account.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â order items + notes */}
          <div className="lg:col-span-3 space-y-4">
            {/* Order items */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-slate-500" />
                <h2 className="font-medium text-slate-800">Order Items ({getTotalItems()})</h2>
              </div>
              <div className="divide-y divide-slate-50">
                {items.map((item) => (
                  <div key={item._id || item.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={item.imageUrl || (item.images && item.images[0]) || '/placeholder-image.jpg'}
                        alt={item.name || item.seoTitle}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => { e.target.src = '/placeholder-image.jpg' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-800 text-sm truncate">{item.name || item.seoTitle}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-slate-900 text-sm">{formatPrice(item.price * item.quantity)}</p>
                      {item.quantity > 1 && <p className="text-xs text-slate-400">{formatPrice(item.price)} each</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Notes */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Order Notes <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 text-sm resize-none transition-all outline-none"
                placeholder="Any special instructions for your order..."
              />
            </div>
          </div>

          {/* Right ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â order summary + payment */}
          <div className="lg:col-span-2 space-y-4">
            {/* Account */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <h3 className="text-sm font-medium text-slate-700 mb-3">Ordering as</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center font-semibold text-violet-800 text-sm">
                  {(user?.fullName || user?.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-slate-800 text-sm truncate">{user?.fullName || 'User'}</p>
                  <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <h3 className="text-sm font-medium text-slate-700 mb-4">Order Summary</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal ({getTotalItems()} items)</span>
                  <span className="text-slate-800 font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="border-t border-slate-100 pt-2.5 flex justify-between text-base font-semibold">
                  <span className="text-slate-900">Total</span>
                  <span className="text-slate-900">{formatPrice(subtotal)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-medium text-slate-700">Payment Method</h3>
              </div>
              <div className="flex items-center gap-3 p-3 border border-violet-300 bg-violet-50/50 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
                <div>
                  <p className="font-medium text-slate-800 text-sm">Pay Online (Razorpay QR & UPI)</p>
                  <p className="text-xs text-slate-500">Fast & secure digital delivery via UPI, QR code, or Cards</p>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-violet-500 to-violet-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-violet-300/40 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] text-base"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
                  Placing Order...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  Place Order Ãƒâ€šÃ‚Â· {formatPrice(subtotal)}
                </span>
              )}
            </button>

            <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" />
              Secured with 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout