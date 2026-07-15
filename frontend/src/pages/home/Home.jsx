import React from 'react'
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
    title: 'GCHub | Buy & Sell Gift Cards, Vouchers & Games',
    description: 'Welcome to GCHub. The premier platform to buy and sell gift cards, game keys, and digital vouchers instantly. Find the best rates and instant payout options.',
    keywords: 'buy gift cards, sell gift cards, game vouchers, gift card exchange, GCHub',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "GCHub",
      "url": "https://gchub.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://gchub.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  })

  const bundleGameImages = bundleGameSlugs.map((slug) => games[slug]?.img).filter(Boolean)

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Banner Carousel for Voucher Cash */}
      <div className="py-6">
        <HeroSection />
      </div>

      <PopularGiftCards />

      {/* Popular AAA Games Section */}
      <div className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 text-center flex-1">Buy Popular AAA Games</h2>
            <button
              onClick={() => navigate('/games')}
              className="hidden sm:flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { _id: 'gta-5', name: 'GTA 5', slug: 'gta-5', img: '/games/gta5.jpeg', price: 359, originalPrice: 1200, imageUrl: '/games/gta5.jpeg' },
              { _id: 'rdr2', name: 'RDR2', slug: 'rdr2', img: '/games/rdr2.jpeg', price: 359, originalPrice: 1200, imageUrl: '/games/rdr2.jpeg' },
              { _id: 'cyberpunk', name: 'Cyberpunk', slug: 'cyberpunk', img: '/games/cyberpunk%202077.jpeg', price: 359, originalPrice: 1200, imageUrl: '/games/cyberpunk%202077.jpeg' },
              { _id: 'the-last-of-us-2', name: 'The Last of Us 2', slug: 'the-last-of-us-2', img: '/games/the%20last%20of%20us%202.jpeg', price: 359, originalPrice: 1200, imageUrl: '/games/the%20last%20of%20us%202.jpeg' },
              { _id: 'resident-evil-4', name: 'Resident Evil 4', slug: 'resident-evil-4', img: '/games/resident%20evil%204.jpeg', price: 359, originalPrice: 1200, imageUrl: '/games/resident%20evil%204.jpeg' },
              { _id: 'bundle-all-11', name: 'Top 6 Bundle', fullName: 'Top 6 AAA Game Bundle', slug: 'bundle-all-11', price: 799, originalPrice: 6300, isBundle: true },
            ].map((game) => {
              const isBundle = game.isBundle
              return (
              <div key={game.name} onClick={() => !isBundle && navigate(`/games/${game.slug}`)} className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200 relative group flex flex-col cursor-pointer ${isBundle ? 'sm:hidden' : ''}`}>
                <div className="relative">
                  {isBundle ? (
                    <div className="w-full aspect-square bg-gray-900 overflow-hidden">
                      <div className="grid grid-cols-2 h-full w-full gap-0.5 p-0.5">
                        {bundleGameImages.map((src, i) => (
                          <img key={i} src={src} alt="" className="w-full h-full object-cover" />
                        ))}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent flex items-end pb-2 pl-2">
                        <Sparkles className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-white text-[10px] font-bold uppercase tracking-wider">Bundle</span>
                      </div>
                    </div>
                  ) : game.img ? (
                    <img
                      src={game.img}
                      alt={game.name}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full aspect-square flex items-center justify-center text-gray-400 text-xs text-center px-2 bg-gray-50">
                      {game.name}
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md">
                    -{Math.round(((game.originalPrice - game.price) / game.originalPrice) * 100)}% OFF
                  </div>
                </div>
                <div className="p-3 flex flex-col gap-2">
                  <h3 className={`font-semibold text-gray-900 leading-tight ${isBundle ? 'text-[11px]' : 'text-sm'}`}>{isBundle ? game.fullName : game.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">₹{game.price}</span>
                    <span className="text-xs text-gray-400 line-through">₹{game.originalPrice}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); const item = isBundle ? { _id: game._id, name: game.fullName, price: game.price, originalPrice: game.originalPrice, images: bundleGameImages } : game; addToCart(item); if (isBundle) { toast.success('Game bundle added to cart!') } else { navigate('/cart') } }} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg text-[10px] sm:text-xs transition-all duration-200 cursor-pointer">
                      Buy Now
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); const item = isBundle ? { _id: game._id, name: game.fullName, price: game.price, originalPrice: game.originalPrice, images: bundleGameImages } : game; addToCart(item); toast.success(isBundle ? 'Game bundle added to cart!' : `${game.name} added to cart!`) }} className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg text-[10px] sm:text-xs transition-all duration-200 cursor-pointer">
                      <><span className="sm:hidden">Add Cart</span><span className="hidden sm:inline">Add to Cart</span></>
                    </button>
                  </div>
                </div>
              </div>
            )})}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <button
              onClick={() => navigate('/games')}
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-200 cursor-pointer"
            >
              View All Games
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

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
        <button onClick={() => navigate('/sell-voucher')} className="group relative inline-flex items-center justify-center gap-0.5 sm:gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-1.5 sm:py-4 px-1 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 overflow-hidden text-[10px] sm:text-base flex-1 sm:flex-none">
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Rahul Sharma', rating: 5, text: 'bc GTA 5 ka code mil gaya 2 minute mein, best website hai yeh!', initials: 'RS' },
              { name: 'Priya Patel', rating: 5, text: 'Google Play voucher instantly aagaya, 20% off mil gaya, kamaal kar diya!', initials: 'PP' },
              { name: 'Amit Verma', rating: 4, text: 'Amazon gift card becha, payment 5 min mein aa gayi. Thoda aur rate hota to maza aata!', initials: 'AV' },
              { name: 'Manish Reddy', rating: 5, text: 'Got my Steam wallet code in 2 minutes. Game bundle sale mein bohot accha deal mila!', initials: 'MR' },
              { name: 'Vikram Singh', rating: 5, text: 'Bought an Apple gift card at great price. Code delivered in under a minute. Legit platform bro!', initials: 'VS' },
              { name: 'Arjun Mehta', rating: 5, text: 'Mere bhai ke liye GTA 5 aur RDR2 ka bundle liya. Itna sasta kahi nahi milega!', initials: 'AM' },
              { name: 'Rohit Joshi', rating: 5, text: 'Bought a Google Play voucher and got 15% off. Delivery was instant. Highly recommended!', initials: 'RJ' },
              { name: 'Karan Joshi', rating: 5, text: 'Sold my unused Flipkart voucher. Got better rate than any other platform. Will use again for sure!', initials: 'KJ' },
            ].map((review, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold text-[10px] sm:text-sm">
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
                <p className="text-gray-600 text-[11px] sm:text-sm leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

export default Home
