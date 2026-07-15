import React from 'react'
import { ShieldAlert, RotateCcw, Clock, AlertTriangle, FileText, Mail } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'

const RefundPolicy = () => {
  useSEO({
    title: 'Refund Policy | GCHub Gift Cards & Game Vouchers',
    description: 'Read the GCHub Refund Policy. Learn about conditions under which refunds, exchanges, or returns for digital gift cards and game keys may be processed.',
    keywords: 'GCHub refund policy, digital voucher returns, game key refunds, gift card returns policy'
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-px w-12 sm:w-20 bg-gray-300"></span>
            <div className="bg-violet-500 p-3 rounded-xl">
              <RotateCcw className="w-6 h-6 text-black" />
            </div>
            <span className="h-px w-12 sm:w-20 bg-gray-300"></span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-3">
            Refund <span className="text-violet-500">Policy</span>
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Last updated: June 2026
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 space-y-8">

          <div className="flex items-start gap-4">
            <div className="bg-red-50 p-2.5 rounded-lg shrink-0">
              <ShieldAlert className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">No Refund Policy</h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                At Voucher Cash, all sales are <strong className="text-gray-900">final and non-refundable</strong>. 
                Once a digital product Ã¢â‚¬â€ including game keys, gift cards, vouchers, and codes Ã¢â‚¬â€ is purchased and 
                delivered, it cannot be returned, exchanged, or refunded for any reason.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-violet-50 p-2.5 rounded-lg shrink-0">
              <AlertTriangle className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Why No Refunds?</h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Digital products are delivered instantly and cannot be "returned" once the code or key 
                has been revealed. Due to the nature of digital goods, we cannot verify whether a product 
                has been used or redeemed after delivery, making refunds impractical.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-blue-50 p-2.5 rounded-lg shrink-0">
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">When a Refund May Be Issued</h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                In the rare event that a purchased voucher or game key is found to be invalid, 
                defective, or does not work as described, you may be eligible for a refund. 
                This applies only if the issue is on our end and cannot be resolved by our support team.
              </p>
              <ul className="mt-3 space-y-2 text-sm sm:text-base text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-0.5">Ã¢â‚¬Â¢</span>
                  <span>The code/voucher was already used before delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-0.5">Ã¢â‚¬Â¢</span>
                  <span>The code does not match the product description</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-0.5">Ã¢â‚¬Â¢</span>
                  <span>The product was not delivered due to a technical error</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-0.5">Ã¢â‚¬Â¢</span>
                  <span>Wrong product was delivered to your account</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-green-50 p-2.5 rounded-lg shrink-0">
              <Clock className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Refund Processing Time</h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                If your refund request is approved, the refund will be processed within 
                <strong className="text-gray-900"> 3Ã¢â‚¬â€œ5 business days</strong>. The amount will be credited 
                back to your original payment method. Please note that it may take additional time for 
                the refund to reflect in your account depending on your bank or payment provider.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-purple-50 p-2.5 rounded-lg shrink-0">
              <Mail className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">How to Request a Refund</h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                If you believe your issue qualifies for a refund, please contact our support team 
                within <strong className="text-gray-900">7 days</strong> of purchase with your order 
                ID and a detailed description of the problem.
              </p>
              <div className="mt-4 bg-gray-50 rounded-xl p-4 sm:p-5">
                <p className="font-medium text-gray-800 text-sm sm:text-base mb-1">Contact Us:</p>
                <p className="text-gray-600 text-sm">Email: support@vouchercash.online</p>
                <p className="text-gray-600 text-sm mt-1">Chat: Available 24/7 on our website</p>
              </div>
            </div>
          </div>

          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base text-violet-900 leading-relaxed">
                <strong className="font-semibold">Important:</strong> By making a purchase on Voucher Cash, 
                you acknowledge that you have read and agreed to this Refund Policy. We strongly 
                recommend verifying your order details before completing any transaction.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default RefundPolicy
