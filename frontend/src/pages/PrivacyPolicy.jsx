import React from 'react'
import { Shield, Lock, Eye, Database, Mail, Cookie, UserCheck, AlertTriangle } from 'lucide-react'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-px w-12 sm:w-20 bg-gray-300"></span>
            <div className="bg-yellow-400 p-3 rounded-xl">
              <Shield className="w-6 h-6 text-black" />
            </div>
            <span className="h-px w-12 sm:w-20 bg-gray-300"></span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-3">
            Privacy <span className="text-yellow-500">Policy</span>
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Last updated: June 2026
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 space-y-8">

          <div className="flex items-start gap-4">
            <div className="bg-blue-50 p-2.5 rounded-lg shrink-0">
              <Eye className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Introduction</h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                At GCHub, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you visit our platform and use our 
                services. By using GCHub, you consent to the practices described in this policy.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-green-50 p-2.5 rounded-lg shrink-0">
              <Database className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Information We Collect</h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3">
                We may collect the following types of information:
              </p>
              <ul className="space-y-2 text-sm sm:text-base text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span><strong className="text-gray-900">Personal Information:</strong> Name, email address, phone number, and billing details when you create an account or make a transaction.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span><strong className="text-gray-900">Payment Information:</strong> Bank account details and UPI IDs for processing payouts. All payment data is handled securely through our payment partners.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span><strong className="text-gray-900">Usage Data:</strong> Information about how you interact with our platform, including pages visited, products viewed, and transaction history.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span><strong className="text-gray-900">Device Information:</strong> IP address, browser type, operating system, and device identifiers for analytics and security purposes.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-purple-50 p-2.5 rounded-lg shrink-0">
              <Lock className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">How We Use Your Information</h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3">
                Your information helps us provide, maintain, and improve our services:
              </p>
              <ul className="space-y-2 text-sm sm:text-base text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>To process and fulfill your orders and sell listing requests</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>To process payouts and transfer funds to your bank account</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>To communicate with you about orders, promotions, and support requests</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>To detect and prevent fraudulent activity and ensure platform security</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>To improve our platform, user experience, and customer support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>To comply with legal obligations and enforce our terms of service</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-amber-50 p-2.5 rounded-lg shrink-0">
              <UserCheck className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Data Sharing & Disclosure</h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                We do not sell your personal information to third parties. We may share your data only 
                with trusted service providers who assist in operating our platform (payment processors, 
                email services, analytics providers), and only as necessary to provide our services. We 
                may also disclose information if required by law or to protect our rights and safety.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-red-50 p-2.5 rounded-lg shrink-0">
              <Cookie className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Cookies & Tracking</h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                GCHub uses cookies and similar tracking technologies to enhance your browsing experience, 
                analyze site traffic, and understand where our visitors come from. You can control cookie 
                preferences through your browser settings. Disabling cookies may affect certain 
                functionality of the platform.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-indigo-50 p-2.5 rounded-lg shrink-0">
              <Shield className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Data Security</h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                We implement industry-standard security measures including SSL encryption, secure data 
                storage, and regular security audits to protect your personal information. However, no 
                method of transmission over the Internet is 100% secure, and we cannot guarantee absolute 
                security.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-teal-50 p-2.5 rounded-lg shrink-0">
              <Mail className="w-5 h-5 text-teal-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Contact Us</h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                If you have any questions about this Privacy Policy or how we handle your data, please 
                reach out to us:
              </p>
              <div className="mt-4 bg-gray-50 rounded-xl p-4 sm:p-5">
                <p className="text-gray-600 text-sm">Email: support@gchub.com</p>
                <p className="text-gray-600 text-sm mt-1">Chat: Available 24/7 on our website</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base text-yellow-800 leading-relaxed">
                <strong className="font-semibold">Policy Updates:</strong> We may update this Privacy Policy 
                from time to time. Changes will be posted on this page with an updated revision date. 
                Continued use of GCHub after changes constitutes acceptance of the updated policy.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
