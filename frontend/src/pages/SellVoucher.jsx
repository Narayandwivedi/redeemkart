import React, { useState, useEffect, useContext, useRef } from 'react'
import { ArrowLeft, Gift, ChevronDown, Check, Upload, ShieldCheck, Banknote, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { useSEO } from '../hooks/useSEO'

const brands = [
  'Google Play',
  'Amazon Pay Gift Card',
  'Amazon Shopping Voucher',
  'Reliance JioMart Gift Card',
  'Flipkart',
  'Steam',
  'Myntra',
  'BigBasket',
]

const brandLogos = {
  'Google Play': '/products/google%20play.avif',
  'Amazon Pay Gift Card': '/products/amazon.avif',
  'Amazon Shopping Voucher': '/products/amazon.avif',
  Flipkart: '/products/flipkart.avif',
  Steam: '/products/steam.avif',
  Myntra: '/products/myntra.avif',
  BigBasket: '/products/bigbasket.avif',
}

const tenPercentBrands = ['Amazon', 'Amazon Pay Gift Card', 'Amazon Shopping Voucher', 'Flipkart']

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700',
  active: 'bg-emerald-50 text-emerald-700',
  sold: 'bg-blue-50 text-blue-700',
  sold_out: 'bg-blue-50 text-blue-700',
  paid: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-700',
  used: 'bg-purple-50 text-purple-700',
  expired: 'bg-slate-100 text-slate-600',
}

const inputCls =
  'w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition'

const BrandLogo = ({ brand, size = 'w-8 h-8' }) =>
  brandLogos[brand] ? (
    <img src={brandLogos[brand]} alt="" className={`${size} rounded-md object-cover shrink-0`} />
  ) : (
    <span className={`${size} rounded-md bg-slate-100 text-slate-500 flex items-center justify-center shrink-0`}>
      <Gift className="w-4 h-4" />
    </span>
  )

const BrandSelect = ({ value, onSelect }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`${inputCls} flex items-center justify-between gap-3 text-left cursor-pointer ${open ? 'ring-2 ring-emerald-500/30 border-emerald-500' : ''}`}
      >
        {value ? (
          <span className="flex items-center gap-2.5 min-w-0">
            <BrandLogo brand={value} size="w-6 h-6" />
            <span className="truncate font-medium">{value}</span>
          </span>
        ) : (
          <span className="text-slate-400">Select gift card</span>
        )}
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-30 mt-2 w-full max-h-72 overflow-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
        >
          {brands.map((b) => {
            const selected = b === value
            return (
              <li key={b} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => { onSelect(b); setOpen(false) }}
                  className={`w-full flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-left transition-colors cursor-pointer ${selected ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <BrandLogo brand={b} />
                  <span className="flex-1 font-medium">{b}</span>
                  {selected && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

const Label = ({ children, hint, hintClass = 'text-slate-400' }) => (
  <label className="flex items-center justify-between text-[13px] font-medium text-slate-700 mb-1.5">
    <span>{children}</span>
    {hint && <span className={`text-xs font-normal ${hintClass}`}>{hint}</span>}
  </label>
)

const SellVoucher = () => {
  const { BACKEND_URL, isAuthenticated } = useContext(AppContext)
  const navigate = useNavigate()
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(false)

  useSEO({
    title: 'Sell Gift Cards Online for Instant Cash in India | RedeemKart',
    description: 'Sell your unused gift cards and digital vouchers instantly for real cash on RedeemKart. Trade Google Play, Amazon, Flipkart, Steam, Myntra & BigBasket vouchers with fast bank payouts.',
    keywords: 'sell gift cards india, sell gift cards online, gift card cash out, sell google play gift card, sell amazon voucher, flipkart gift card cashout, redeemkart sell voucher',
    ogImage: 'https://redeemkart.in/redeemkart-logo.png',
    canonicalUrl: 'https://redeemkart.in/sell-gift-card',
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Sell Gift Cards Online - RedeemKart",
        "serviceType": "Gift Card Trading & Cashout",
        "provider": {
          "@type": "Organization",
          "name": "RedeemKart",
          "url": "https://redeemkart.in"
        },
        "areaServed": "IN",
        "description": "List your unused gift cards from Google Play, Amazon, Flipkart, Steam, and Myntra to get instant cash payouts directly into your bank account."
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Sell Gift Cards on RedeemKart",
        "description": "Follow these 3 simple steps to turn your unused gift cards into real cash.",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Add Your Card",
            "text": "Select brand, enter gift card balance amount, code, and PIN."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Card Sells",
            "text": "Your card is verified and listed for thousands of buyers. Most cards sell within 24 hours."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Get Paid Direct to Bank",
            "text": "Once sold, money is credited to your wallet and transferred to your bank account."
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How fast will my gift card sell?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Most popular gift cards like Google Play, Amazon, and Flipkart sell within 24 hours."
            }
          },
          {
            "@type": "Question",
            "name": "When do I get paid after selling my gift card?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Money is automatically credited to your RedeemKart wallet and can be withdrawn directly to your bank account."
            }
          },
          {
            "@type": "Question",
            "name": "Are there any listing or selling fees?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Listing is completely free. We charge a commission deducted upon successful sale."
            }
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://redeemkart.in/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Sell Gift Cards",
            "item": "https://redeemkart.in/sell-gift-card"
          }
        ]
      }
    ]
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
    let { name, value } = e.target
    if (form.brand === 'Flipkart' && (name === 'code' || name === 'pin')) {
      value = value.replace(/\D/g, '')
    }
    setForm({ ...form, [name]: value })
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

    if (form.brand === 'Flipkart') {
      const cleanCode = (form.code || '').trim().replace(/\s+/g, '')
      if (!/^\d{16}$/.test(cleanCode)) {
        toast.error('Flipkart card code must be exactly 16 numeric digits (e.g. 6000170522107804)')
        return
      }
      const cleanPin = (form.pin || '').trim().replace(/\s+/g, '')
      if (!cleanPin || !/^\d{6}$/.test(cleanPin)) {
        toast.error('Flipkart PIN is mandatory and must be exactly 6 numeric digits')
        return
      }
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

  const commission = tenPercentBrands.includes(form.brand) ? 10 : 30
  const payout = Math.round((Number(form.balance) || 0) * (1 - commission / 100))

  const steps = [
    { icon: Upload, title: 'List your card', desc: 'Enter card details' },
    { icon: ShieldCheck, title: 'We verify & sell', desc: 'Most sell within 24 hrs' },
    { icon: Banknote, title: 'Get paid', desc: 'Usually in 3-4 hours' },
  ]

  const faqs = [
    { q: 'How fast will my card sell?', a: 'Most popular brand gift cards sell within 24 hours. Less common brands may take 2-3 days.' },
    { q: 'When do I get paid?', a: 'Once your card is sold, the payout is usually released to your bank account in 3-4 hours.' },
    { q: 'Are there any selling fees?', a: 'Listing is free. A commission is deducted from your payout when the card sells.' },
    { q: "What if my code doesn't work?", a: 'Check the code and PIN before listing. Invalid cards are rejected, and fraudulent listings may lead to account suspension.' },
    { q: 'How do I add my bank account?', a: 'Open your Account and go to Payout Details to add and verify your bank account.' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter',sans-serif] text-slate-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex items-center gap-3 mb-5 sm:mb-7">
          <Link to="/" className="p-1.5 -ml-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white transition-colors" aria-label="Back to home">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-['Poppins',sans-serif] text-xl sm:text-3xl font-semibold text-slate-900 tracking-tight">Sell gift cards</h1>
            <p className="text-[13px] sm:text-sm text-slate-500 mt-0.5">List your unused card and get paid to your bank account.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {steps.map(({ icon: Icon, title, desc }, i) => (
                <div key={title} className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center justify-center">{i + 1}</span>
                    <Icon className="w-4 h-4 text-emerald-600 hidden sm:block" />
                  </div>
                  <p className="text-[12px] sm:text-sm font-semibold text-slate-900 leading-tight">{title}</p>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-snug">{desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm">
              <h2 className="font-['Poppins',sans-serif] text-lg sm:text-xl font-semibold text-slate-900 mb-5">List your gift card</h2>

              <div className="space-y-4 sm:space-y-5">
                <div>
                  <Label>Gift card</Label>
                  <BrandSelect value={form.brand} onSelect={(b) => setForm((f) => ({ ...f, brand: b }))} />
                </div>

                <div>
                  <Label>Balance amount (₹)</Label>
                  <input
                    type="number"
                    name="balance"
                    value={form.balance}
                    onChange={handleChange}
                    placeholder="e.g. 1000"
                    className={inputCls}
                  />
                </div>

                <div>
                  <Label hint={form.brand === 'Flipkart' ? '16 digits' : ''} hintClass="text-emerald-600 font-medium">Gift card code</Label>
                  <input
                    type="text"
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    maxLength={form.brand === 'Flipkart' ? 16 : 50}
                    inputMode={form.brand === 'Flipkart' ? 'numeric' : 'text'}
                    placeholder={form.brand === 'Flipkart' ? 'e.g. 6000170522107804' : 'Enter gift card code'}
                    className={`${inputCls} font-mono tracking-wide`}
                  />
                </div>

                {form.brand !== 'Google Play' && (
                  <div>
                    <Label
                      hint={form.brand === 'Flipkart' ? 'Required, 6 digits' : 'Optional'}
                      hintClass={form.brand === 'Flipkart' ? 'text-emerald-600 font-medium' : 'text-slate-400'}
                    >
                      PIN
                    </Label>
                    <input
                      type="text"
                      name="pin"
                      value={form.pin}
                      onChange={handleChange}
                      maxLength={form.brand === 'Flipkart' ? 6 : 20}
                      inputMode={form.brand === 'Flipkart' ? 'numeric' : 'text'}
                      placeholder={form.brand === 'Flipkart' ? 'e.g. 123456' : 'Enter PIN if your card has one'}
                      className={`${inputCls} font-mono tracking-wide`}
                    />
                  </div>
                )}

                <div>
                  <Label hint="Optional">Expiry date</Label>
                  <input
                    type="date"
                    name="expiry"
                    value={form.expiry}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>

                {form.balance > 0 && (
                  <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                    <div>
                      <p className="text-xs text-emerald-800/70">You will receive</p>
                      <p className="text-lg font-semibold text-emerald-700">₹{payout}</p>
                    </div>
                    <p className="text-xs text-emerald-800/70">After {commission}% commission</p>
                  </div>
                )}

                <button
                  onClick={handleAdd}
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? 'Listing...' : 'Publish listing'}
                </button>
              </div>
            </div>

            <div>
              <h2 className="font-['Poppins',sans-serif] text-base sm:text-lg font-semibold text-slate-900 mb-3">Your listings</h2>
              {cards.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-300 rounded-2xl text-center py-10 px-4">
                  <Gift className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-700">No gift cards listed yet</p>
                  <p className="text-xs text-slate-500 mt-1">Fill in the form above to list your first card.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cards.map((card) => (
                    <div key={card._id} className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4">
                      <BrandLogo brand={card.brand} size="w-10 h-10" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-slate-900">{card.brand}</p>
                          {card.status && (
                            <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${statusStyles[card.status] || 'bg-slate-100 text-slate-600'}`}>
                              {['sold', 'sold_out'].includes(card.status) ? 'sold' : card.status}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 truncate font-mono">
                          {card.code.replace(/.(?=.{4})/g, '*')}
                          {card.pin ? `  PIN ${card.pin.replace(/.(?=.{4})/g, '*')}` : ''}
                        </p>
                        {card.expiry && (
                          <p className="text-[11px] text-slate-400 mt-0.5">Exp {new Date(card.expiry).toLocaleDateString('en-IN')}</p>
                        )}
                      </div>
                      <p className="text-base font-semibold text-slate-900">₹{card.balance}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="lg:col-span-1 space-y-4 lg:sticky lg:top-24">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
              <h3 className="font-['Poppins',sans-serif] text-base font-semibold text-slate-900 mb-3">Frequently asked questions</h3>
              <div className="divide-y divide-slate-100">
                {faqs.map((f) => (
                  <details key={f.q} className="group py-3 first:pt-0 last:pb-0">
                    <summary className="flex items-center justify-between gap-3 cursor-pointer list-none text-sm font-medium text-slate-800">
                      {f.q}
                      <ChevronDown className="w-4 h-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="text-[13px] text-slate-500 mt-2 leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Step-by-step guides</h3>
              <div className="space-y-1.5 text-sm">
                <Link to="/how-to-sell-flipkart-gift-card" className="block text-emerald-700 hover:text-emerald-800 font-medium">How to sell Flipkart gift card &rarr;</Link>
                <Link to="/how-to-sell-amazon-gift-card" className="block text-emerald-700 hover:text-emerald-800 font-medium">How to sell Amazon gift card &rarr;</Link>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-100 p-5">
              <h3 className="text-sm font-semibold text-slate-900">Need help?</h3>
              <p className="text-[13px] text-slate-500 mt-1 mb-2">Our support team is here to assist you.</p>
              <Link to="/contact" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">Contact support &rarr;</Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default SellVoucher
