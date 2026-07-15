import React, { useState, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { useCart } from '../context/CartContext'
import AddressManager from './AddressManager'
import { toast } from 'react-toastify'

const CheckoutFlow = ({ onClose, onSuccess }) => {
  const { BACKEND_URL, isAuthenticated, user } = useContext(AppContext)
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [customerNotes, setCustomerNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (isAuthenticated === false) {
      onClose()
      window.location.href = '/login'
    }
  }, [isAuthenticated, onClose])


  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const canProceedToStep2 = () => {
    return selectedAddressId !== null
  }

  const handlePlaceOrder = async () => {
    if (!canProceedToStep2()) {
      toast.error('Please select a delivery address')
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare order data using logged-in user info
      const orderData = {
        customerInfo: {
          name: user.fullName,
          email: user.email,
          phone: user.phone || ''
        },
        items: items.map(item => ({
          productId: item._id || item.id,
          quantity: item.quantity
        })),
        customerNotes,
        paymentMethod
      }

      // Add address information for logged-in user
      orderData.userId = user._id
      orderData.addressId = selectedAddressId

      // Submit order
      const response = await fetch(`${BACKEND_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(orderData)
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`Order placed successfully! Order Number: ${result.data.orderNumber}`)
        clearCart()
        onSuccess && onSuccess(result.data)
        onClose && onClose()
      } else {
        throw new Error(result.message || 'Failed to place order')
      }

    } catch (error) {
      console.error('Error placing order:', error)
      toast.error(error.message || 'Failed to place order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { number: 1, title: 'Select Address', completed: canProceedToStep2() },
    { number: 2, title: 'Review & Payment', completed: false }
  ]

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Checkout</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                    currentStep === step.number 
                      ? 'bg-cyan-600' 
                      : step.completed 
                        ? 'bg-green-500' 
                        : 'bg-gray-300'
                  }`}>
                    {step.completed && currentStep !== step.number ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    currentStep === step.number ? 'text-cyan-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    step.completed ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step Content */}
          <div className="space-y-6">
            {/* Step 1: Address Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800">
                    Logged in as <strong>{user?.fullName}</strong> ({user?.email})
                  </p>
                </div>
                <AddressManager 
                  onAddressSelect={setSelectedAddressId}
                  selectedAddressId={selectedAddressId}
                  showSelection={true}
                />
              </div>
            )}

            {/* Step 2: Review & Payment */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Review Your Order</h3>
                
                {/* Order Items */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Order Items ({getTotalItems()})</h4>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item._id || item.id} className="flex justify-between items-center">
                        <span className="text-gray-700">
                          {item.name || item.seoTitle} × {item.quantity}
                        </span>
                        <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-200 mt-3 pt-3 space-y-1">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatPrice(getTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (18%):</span>
                      <span>{formatPrice(getTotalPrice() * 0.18)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                      <span>Total:</span>
                      <span>{formatPrice(getTotalPrice() * 1.18)}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="Any special instructions for delivery..."
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Payment Method</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-cyan-600 focus:ring-cyan-500"
                      />
                      <span className="ml-2">Cash on Delivery (COD)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}
            </div>
            
            {currentStep < 2 ? (
              <button
                onClick={() => {
                  if (currentStep === 1 && canProceedToStep2()) {
                    setCurrentStep(2)
                  }
                }}
                disabled={currentStep === 1 && !canProceedToStep2()}
                className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Placing Order...
                  </div>
                ) : (
                  'Place Order'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutFlow