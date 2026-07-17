import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Zap } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'

const Contact = () => {
  useSEO({
    title: 'Contact RedeemKart Support | Get Assistance Instantly',
    description: 'Contact RedeemKart support team for assistance with gift card trading, voucher payouts, game key purchases, or other inquiries.',
    keywords: 'contact RedeemKart, gift card support, RedeemKart customer care, support email'
  })

  const { isAuthenticated } = useContext(AppContext) || {}
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Get In <span className="text-violet-500">Touch</span>
          </h1>
          <p className="text-sm text-gray-600 mt-1">We'd love to hear from you</p>
        </div>

        {isAuthenticated && (
          <div className="mb-6 text-center">
            <Link
              to="/chat"
              className="inline-flex items-center gap-1.5 bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-violet-500/40 transition-all duration-200 text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Live Chat</span>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Contact Info */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-violet-500 p-2 rounded-lg shrink-0">
                    <Mail className="w-4 h-4 text-black" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Email</p>
                    <a href="mailto:support@redeemkart.in" className="text-sm font-medium text-gray-900 hover:text-violet-700 transition-colors truncate block">
                      support@redeemkart.in
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-violet-500 p-2 rounded-lg shrink-0">
                    <Phone className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Phone</p>
                    <a href="tel:+916264682508" className="text-sm font-medium text-gray-900 hover:text-violet-700 transition-colors block">
                      +91 62646 82508
                    </a>
                    <a href="tel:+919202469725" className="text-sm font-medium text-gray-900 hover:text-violet-700 transition-colors block">
                      +91 92024 69725
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-violet-500 p-2 rounded-lg shrink-0">
                    <MapPin className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Address</p>
                    <p className="text-sm text-gray-900">123 Tech Street, New Delhi 110001</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-violet-500 p-2 rounded-lg shrink-0">
                    <Clock className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Hours</p>
                    <p className="text-sm text-gray-900">Mon-Sat 10AM-8PM</p>
                    <p className="text-sm text-gray-900">Sun 11AM-6PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-gray-900">Follow Us</h2>
              </div>
              <div className="flex gap-2">
                {[
                  { icon: <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /> },
                  { icon: <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.754-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.001 12.017z" /> },
                  { icon: <> <path d="M12.224 2.162c3.204 0 3.584.012 4.849.07 1.17.054 1.805.249 2.227.413.56.217.96.477 1.382.896.419.42.677.819.896 1.381.164.422.36 1.057.413 2.227.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.849c-.054 1.17-.249 1.805-.413 2.227a3.81 3.81 0 0 1-.896 1.382 3.744 3.744 0 0 1-1.382.896c-.422.164-1.057.36-2.227.413-1.265.058-1.645.07-4.849.07s-3.584-.012-4.849-.07c-1.17-.054-1.805-.249-2.227-.413a3.81 3.81 0 0 1-1.382-.896 3.744 3.744 0 0 1-.896-1.382c-.164-.422-.36-1.057-.413-2.227-.058-1.265-.07-1.645-.07-4.849s.012-3.584.07-4.849c.054-1.17.249-1.805.413-2.227.217-.56.477-.96.896-1.382a3.744 3.744 0 0 1 1.382-.896c.422-.164 1.057-.36 2.227-.413 1.265-.058 1.645-.07 4.849-.07zm0-2.162c-3.259 0-3.667.014-4.947.072-1.281.058-2.154.26-2.913.558a5.885 5.885 0 0 0-2.134 1.389 5.868 5.868 0 0 0-1.389 2.134c-.297.759-.5 1.632-.558 2.913-.058 1.281-.072 1.688-.072 4.947s.014 3.667.072 4.947c.058 1.281.26 2.154.558 2.913a5.885 5.885 0 0 0 1.389 2.134 5.868 5.868 0 0 0 2.134 1.389c.759.297 1.632.5 2.913.558 1.281.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.281-.058 2.154-.26 2.913-.558a5.885 5.885 0 0 0 2.134-1.389 5.868 5.868 0 0 0 1.389-2.134c.297-.759.5-1.632.558-2.913.058-1.281.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.058-1.281-.26-2.154-.558-2.913a5.885 5.885 0 0 0-1.389-2.134A5.868 5.868 0 0 0 19.86.63c-.759-.297-1.632-.5-2.913-.558C15.667.014 15.259 0 12 0z" /> <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" /> <circle cx="18.406" cy="5.594" r="1.44" /> </> },
                ].map((s, i) => (
                  <a key={i} href="#" className="bg-gray-900 hover:bg-gray-800 p-2.5 rounded-lg transition-all duration-200 group">
                    <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">{s.icon}</svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Form */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h2 className="text-base font-semibold text-gray-900">Send us a Message</h2>
              <p className="text-xs text-gray-500 mb-4">We'll get back within 24 hours.</p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="name" className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Name *</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-gray-50 focus:bg-white text-sm"
                      placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Email *</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-gray-50 focus:bg-white text-sm"
                      placeholder="your@email.com" />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Subject *</label>
                  <select id="subject" name="subject" value={formData.subject} onChange={handleInputChange} required
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-gray-50 focus:bg-white text-sm cursor-pointer">
                    <option value="">Choose a topic</option>
                    <option value="gift-cards">Gift Cards / Vouchers</option>
                    <option value="game-keys">Game Keys</option>
                    <option value="refund">Refund Issue</option>
                    <option value="sell-gift-card">Sell Voucher</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Message *</label>
                  <textarea id="message" name="message" rows={4} value={formData.message} onChange={handleInputChange} required
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none bg-gray-50 focus:bg-white text-sm"
                    placeholder="How can we help?"></textarea>
                </div>

                <button type="submit"
                  className="w-full bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-200 shadow-md hover:shadow-violet-500/40 text-sm cursor-pointer">
                  <div className="flex items-center justify-center gap-1.5">
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </div>
                </button>
              </form>

              <div className="mt-4 p-3 bg-violet-50 border border-violet-200 rounded-lg">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 mb-2">
                  <Zap className="w-3.5 h-3.5 text-violet-500" />
                  Quick Response
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-gray-600">
                  <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-violet-500"></span>Email: 2-4 hrs</span>
                  <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-violet-500"></span>Phone: Immediate</span>
                  <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-violet-500"></span>Support: Same day</span>
                  <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-violet-500"></span>Orders: Real-time</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Contact
