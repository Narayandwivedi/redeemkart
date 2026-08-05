import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Gift, Gamepad2, DollarSign, ArrowRight, Star, Sparkles } from 'lucide-react'
import HeroSection from './component/HeroSection'
import PopularGiftCards from './component/PopularGiftCards'
import { useCart } from '../../context/CartContext'
import { toast } from 'react-toastify'
import { games, bundleGameSlugs } from '../../data/games'
import { useSEO } from '../../hooks/useSEO'

const Home = () => {
  const navigate = useNavigate()
  const { addToCart } = useCart()

  useSEO({
    title: 'RedeemKart | Buy & Sell Gift Cards, Vouchers & Games in India',
    description: 'RedeemKart — India\'s #1 gift card trading platform. Sell unused gift cards for instant cash or buy discounted Amazon, Flipkart, Google Play, Steam vouchers. Best rates guaranteed.',
    keywords: 'buy gift cards india, sell gift cards online, gift card marketplace india, discounted gift cards, google play gift card india, amazon gift card sell, flipkart voucher cashout, RedeemKart',
    ogImage: 'https://redeemkart.in/redeemkart-logo.png',
    canonicalUrl: 'https://redeemkart.in/',
    structuredDataId: 'home-structured-data',
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "RedeemKart",
        "url": "https://redeemkart.in",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://redeemkart.in/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I sell a gift card on RedeemKart?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Simply visit the Sell Gift Card page, enter your gift card brand, code, and the amount. Once verified and sold, the money is deposited directly into your bank account within 24 hours."
            }
          },
          {
            "@type": "Question",
            "name": "Can I buy discounted gift cards on RedeemKart?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! RedeemKart offers gift cards from brands like Amazon, Flipkart, Google Play, Steam, Myntra and BigBasket at prices below face value. You get real savings on every purchase."
            }
          },
          {
            "@type": "Question",
            "name": "Is RedeemKart safe for gift card trading?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, RedeemKart is 100% safe. Every gift card code is verified before sale, and buyer payments are protected. We use secure payment processing and have served 10,000+ happy traders."
            }
          },
          {
            "@type": "Question",
            "name": "How fast do I receive cash after selling a gift card?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Once your gift card is purchased by a buyer, the amount is credited to your RedeemKart wallet instantly. You can withdraw to your bank account anytime with no minimum balance requirement."
            }
          }
        ]
      }
    ]
  })

  const bundleGameImages = bundleGameSlugs.map((slug) => games[slug]?.img).filter(Boolean)

  const gradients = [
    'from-cyan-500 to-blue-600',
    'from-pink-500 to-rose-600',
    'from-amber-500 to-orange-600',
    'from-green-500 to-emerald-600',
    'from-purple-500 to-violet-600',
    'from-red-500 to-pink-600',
    'from-indigo-500 to-blue-600',
    'from-teal-500 to-cyan-600',
  ]

  const reviews = [
    { name: 'Rahul Sharma', rating: 5, text: 'bc GTA 5 ka code mil gaya 2 minute mein, best website hai yeh!', initials: 'RS' },
    { name: 'Priya Patel', rating: 5, text: 'Google Play voucher instantly aagaya, 20% off mil gaya, kamaal kar diya!', initials: 'PP' },
    { name: 'Amit Verma', rating: 4, text: 'Amazon gift card becha, payment 5 min mein aa gayi. Thoda aur rate hota to maza aata!', initials: 'AV' },
    { name: 'Manish Reddy', rating: 5, text: 'Got my Steam wallet code in 2 minutes. Game bundle sale mein bohot accha deal mila!', initials: 'MR' },
    { name: 'Vikram Singh', rating: 5, text: 'Bought an Apple gift card at great price. Code delivered in under a minute. Legit platform bro!', initials: 'VS' },
    { name: 'Arjun Mehta', rating: 5, text: 'Mere bhai ke liye GTA 5 aur RDR2 ka bundle liya. Itna sasta kahi nahi milega!', initials: 'AM' },
    { name: 'Rohit Joshi', rating: 5, text: 'Bought a Google Play voucher and got 15% off. Delivery was instant. Highly recommended!', initials: 'RJ' },
    { name: 'Karan Joshi', rating: 5, text: 'Sold my unused Flipkart voucher. Got better rate than any other platform. Will use again for sure!', initials: 'KJ' },
  ]

  const [page, setPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(4)

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth
      if (w < 640) setItemsPerPage(2)
      else if (w < 1024) setItemsPerPage(2)
      else setItemsPerPage(4)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const totalPages = Math.ceil(reviews.length / itemsPerPage)
  const currentReviews = reviews.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage)

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Banner Carousel for Voucher Cash */}
      <div className="py-6">
        <HeroSection />
      </div>

      <PopularGiftCards />

      {/* Quick Links */}
      <div className="py-6 bg-white border-b border-slate-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Quick Links</h2>
        <div className="flex flex-row justify-center gap-2 sm:gap-4 px-3 sm:px-0 max-w-full">
        <button onClick={() => navigate('/search?q=vouchers')} className="group relative inline-flex items-center justify-center gap-0.5 sm:gap-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold py-1.5 sm:py-4 px-1 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 overflow-hidden text-[10px] sm:text-base flex-1 sm:flex-none">
          <Gift className="w-3 h-3 sm:w-5 sm:h-5" />
          <span>Buy Voucher</span>
          <ArrowRight className="w-2 h-2 sm:w-4 sm:h-4 opacity-0 -ml-1 sm:-ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 hidden sm:inline" />
        </button>
        <button onClick={() => navigate('/search?q=games')} className="group relative inline-flex items-center justify-center gap-0.5 sm:gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-1.5 sm:py-4 px-1 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 overflow-hidden text-[10px] sm:text-base flex-1 sm:flex-none">
          <Gamepad2 className="w-3 h-3 sm:w-5 sm:h-5" />
          <span>Buy Games</span>
          <ArrowRight className="w-2 h-2 sm:w-4 sm:h-4 opacity-0 -ml-1 sm:-ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 hidden sm:inline" />
        </button>
        <button onClick={() => navigate('/sell-gift-card')} className="group relative inline-flex items-center justify-center gap-0.5 sm:gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-1.5 sm:py-4 px-1 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 overflow-hidden text-[10px] sm:text-base flex-1 sm:flex-none">
          <DollarSign className="w-3 h-3 sm:w-5 sm:h-5" />
          <span>Sell Voucher</span>
          <ArrowRight className="w-2 h-2 sm:w-4 sm:h-4 opacity-0 -ml-1 sm:-ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 hidden sm:inline" />
        </button>
      </div>
      </div>

      {/* User Reviews */}
      <div className="py-8 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">What Our Customers Say</h2>
          <div className="relative">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentReviews.map((review, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 min-h-[160px] flex flex-col">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center text-white font-semibold text-[10px] sm:text-sm`}>
                      {review.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 text-[11px] sm:text-sm truncate">{review.name}</p>
                      <div className="flex gap-px sm:gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${j < review.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill={j < review.rating ? 'currentColor' : 'none'} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-[11px] sm:text-sm leading-snug sm:leading-relaxed flex-1">{review.text}</p>
                </div>
              ))}
            </div>

            {page > 0 && (
              <button onClick={() => setPage(page - 1)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:text-violet-600 hover:border-violet-300 transition-all cursor-pointer z-10">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
            )}

            {page < totalPages - 1 && (
              <button onClick={() => setPage(page + 1)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:text-violet-600 hover:border-violet-300 transition-all cursor-pointer z-10">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}

export default Home
