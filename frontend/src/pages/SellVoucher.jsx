import React, { useState, useEffect, useContext } from 'react'
import { ArrowLeft, Plus, Gift, DollarSign, Hash, Calendar, X, Upload, Clock, Banknote, Lock } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { useSEO } from '../hooks/useSEO'

const brands = [
  'Google Play',
  'Amazon',
  'Flipkart',
  'Steam',
  'Myntra',
  'BigBasket',
]

const SellVoucher = () => {
  const { BACKEND_URL, isAuthenticated } = useContext(AppContext)
  const navigate = useNavigate()
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(false)

  useSEO({
    title: 'Sell Gift Cards Online | Instant Cash Out | RedeemKart',
    description: 'Sell your unused gift cards and digital vouchers instantly on RedeemKart. List cards from Google Play, Amazon, Steam, and more to receive fast payouts directly to your bank account.',
    keywords: 'sell gift cards, sell vouchers online, gift card cash out, instant cash for gift cards, flipkart voucher cashout, RedeemKart',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Sell Gift Cards | RedeemKart",
      "description": "Sell your unused gift cards and digital vouchers instantly on RedeemKart. Get paid directly to your bank account."
    }
  })
  const [form, setForm] = useState({
    brand: '',
    balance: '',
    code: '',
    pin: '',
    expiry: '',
  })

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/gift-cards`, { withCredentials: true })
        if (res.data.success) {
          setCards(res.data.data)
        }
      } catch {
        // silently fail
      }
    }
    fetchListings()
  }, [BACKEND_URL])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAdd = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to publish a listing')
      navigate('/login')
      return
    }
    if (!form.brand || !form.balance || !form.code) {
      toast.error('Please fill all fields')
      return
    }
    setLoading(true)
    try {
      const res = await axios.post(`${BACKEND_URL}/api/gift-cards`, form, { withCredentials: true })
      if (res.data.success) {
        setCards([res.data.data, ...cards])
        setForm({ brand: '', balance: '', code: '', pin: '', expiry: '' })
        toast.success('Gift card submitted for review')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to list gift card')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

          {/* Main Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </Link>
              <h1 className="text-lg sm:text-2xl font-semibold text-gray-900">Sell Gift Cards</h1>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 mb-6 sm:mb-8">
            <h2 className="text-center text-[13px] sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">How It Works</h2>
            <div className="flex flex-row items-start sm:items-center gap-0">
              <div className="flex-1 flex flex-col items-center text-center relative">
                <div className="bg-gray-900 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center mb-1.5 sm:mb-2 shadow-md relative z-10">
                  <Upload className="h-3 w-3 sm:h-5 sm:w-5" />
                </div>
                <p className="font-medium text-gray-900 text-[10px] sm:text-sm leading-tight">Add Your Card</p>
                <p className="text-[9px] sm:text-xs text-gray-500 mt-0.5 hidden sm:block">List your gift card for sale</p>
                <div className="absolute top-4 sm:top-5 left-[55%] w-[80%] h-0.5 border-t-[1.5px] sm:border-t-2 border-dashed border-gray-300 z-0" />
              </div>
              <div className="flex-1 flex flex-col items-center text-center relative">
                <div className="bg-gray-900 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center mb-1.5 sm:mb-2 shadow-md relative z-10">
                  <Clock className="h-3 w-3 sm:h-5 sm:w-5" />
                </div>
                <p className="font-medium text-gray-900 text-[10px] sm:text-sm leading-tight">Sells in 24 Hrs</p>
                <p className="text-[9px] sm:text-xs text-gray-500 mt-0.5 hidden sm:block">Fast & easy selling process</p>
                <div className="absolute top-4 sm:top-5 left-[55%] w-[80%] h-0.5 border-t-[1.5px] sm:border-t-2 border-dashed border-gray-300 z-0" />
              </div>
              <div className="flex-1 flex flex-col items-center text-center relative">
                <div className="bg-gray-900 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center mb-1.5 sm:mb-2 shadow-md relative z-10">
                  <Banknote className="h-3 w-3 sm:h-5 sm:w-5" />
                </div>
                <p className="font-medium text-gray-900 text-[10px] sm:text-sm leading-tight">Get Paid</p>
                <p className="text-[9px] sm:text-xs text-gray-500 mt-0.5 hidden sm:block">Money credited to your bank</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-50 via-white to-orange-50 rounded-xl shadow-md border border-violet-200 p-5 sm:p-6 mb-6 sm:mb-8 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>

            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Gift className="h-6 w-6 text-violet-700" />
              List Your Gift Card
            </h2>

            <div className="grid grid-cols-1 gap-5 relative z-10">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1.5">Brand</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Gift className="h-4 w-4 text-violet-700" />
                  </div>
                  <select
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    className="w-full pl-10 border border-violet-300 bg-white/80 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 shadow-sm transition-shadow appearance-none"
                  >
                    <option value="">Select brand</option>
                    {brands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1.5">Balance Amount (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-violet-700" />
                  </div>
                  <input
                    type="number"
                    name="balance"
                    value={form.balance}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    className="w-full pl-10 border border-violet-300 bg-white/80 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 shadow-sm transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1.5">Gift Card Code</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash className="h-4 w-4 text-violet-700" />
                  </div>
                  <input
                    type="text"
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="Enter gift card code"
                    className="w-full pl-10 border border-violet-300 bg-white/80 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 shadow-sm transition-shadow"
                  />
                </div>
              </div>

              {form.brand !== 'Google Play' && (
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1.5">
                    PIN <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-violet-700" />
                    </div>
                    <input
                      type="text"
                      name="pin"
                      value={form.pin}
                      onChange={handleChange}
                      placeholder="Enter PIN if required"
                      className="w-full pl-10 border border-violet-300 bg-white/80 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 shadow-sm transition-shadow"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1.5">
                  Expiry Date <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-violet-700" />
                  </div>
                  <input
                    type="date"
                    name="expiry"
                    value={form.expiry}
                    onChange={handleChange}
                    className="w-full pl-10 border border-violet-300 bg-white/80 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 shadow-sm transition-shadow"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleAdd}
                  disabled={loading}
                  className="w-full py-3 text-white font-semibold text-base rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 55%, #6d28d9 100%)',
                    boxShadow: '0 4px 14px rgba(139,92,246,0.4)',
                  }}
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                  {loading ? 'Listing...' : 'Publish Listing'}
                </button>
              </div>

              {form.balance > 0 && (
                <div className="text-center -mt-2">
                  <p className="text-sm font-medium text-gray-700">
                    You'll receive: <span className="text-emerald-600">₹{Math.round(form.balance * (form.brand === 'Google Play' ? 0.7 : 0.9))}</span>
                    <span className="text-gray-400 font-normal"> (after {form.brand === 'Google Play' ? 30 : 10}% commission)</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Active Listings</h2>
        {cards.length === 0 ? (
          <div className="text-center py-20">
            <Gift className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No gift cards added yet</p>
            <p className="text-gray-400 text-sm mt-1">Click "Add New Card" to get started</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {cards.map((card) => (
              <div
                key={card._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <Gift className="h-6 w-6 text-gray-700" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{card.brand}</p>
                    <p className="text-sm text-gray-500">
                      Code: {card.code.replace(/.(?=.{4})/g, '*')} | {card.pin ? `PIN: ${card.pin.replace(/.(?=.{4})/g, '*')} |` : ''} ₹{card.balance}{card.expiry ? ` | Exp: ${new Date(card.expiry).toLocaleDateString('en-IN')}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
          </div>

          {/* Sidebar Section - FAQs */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-violet-500 block"></span>
                Frequently Asked Questions
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 text-sm mb-1">How fast will my card sell?</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">Most popular brand gift cards sell within 24 hours. Less common brands may take 2-3 days.</p>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="font-medium text-gray-800 text-sm mb-1">When do I get paid?</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">Money is automatically transferred to your linked bank account or wallet within 48 hours after the buyer verifies the card.</p>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="font-medium text-gray-800 text-sm mb-1">Are there any selling fees?</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">Commission varies by brand. We charge 30% on Google Play cards and 10% on all other brands, deducted from your payout. There are no listing fees.</p>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="font-medium text-gray-800 text-sm mb-1">What if my code doesn't work?</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">Ensure the code and PIN are correct before listing. If a buyer reports an invalid code, we will investigate and may suspend your account if found fraudulent.</p>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="font-medium text-gray-800 text-sm mb-1">How do I add my bank account to get paid?</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">Go to your Account settings and select "Payment Methods". There, you can securely add and verify your bank account or wallet details.</p>
                </div>
              </div>

              <div className="mt-6 bg-violet-50 rounded-lg p-4 border border-violet-200">
                <h4 className="font-medium text-violet-900 text-sm mb-1">Need help?</h4>
                <p className="text-violet-800 text-xs mb-3">Our support team is available 24/7 to assist you.</p>
                <Link to="/contact" className="inline-block text-xs font-semibold text-violet-950 hover:text-violet-800">Contact Support &rarr;</Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default SellVoucher