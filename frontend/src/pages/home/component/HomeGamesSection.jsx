import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, Sparkles } from 'lucide-react'
import { useCart } from '../../../context/CartContext'
import { toast } from 'react-toastify'
import { featuredGames, games } from '../../../data/games'

const sectionGames = [...featuredGames, games['the-witcher-3']].filter(Boolean)

const HomeGamesSection = () => {
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const handleAddToCart = (e, game) => {
    e.stopPropagation()
    addToCart({
      _id: game._id,
      name: game.fullName,
      price: game.price,
      originalPrice: game.originalPrice,
      images: [game.img],
    })
    toast.success(`${game.name} added to cart!`)
  }

  const handleBuyNow = (e, game) => {
    e.stopPropagation()
    addToCart({
      _id: game._id,
      name: game.fullName,
      price: game.price,
      originalPrice: game.originalPrice,
      images: [game.img],
    })
    navigate('/cart')
  }

  return (
    <div className="py-4 md:py-8 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-[28px] font-semibold text-gray-800 text-center flex-1">Popular Games</h2>
          <button
            onClick={() => navigate('/games')}
            className="hidden sm:flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-5">
          {sectionGames.map((game, index) => (
            <div
              key={game._id}
              onClick={() => navigate(`/games/${game.slug}`)}
              className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200 relative group flex flex-col cursor-pointer hover:-translate-y-1 ${index >= 5 ? 'lg:hidden' : ''}`}
            >
              <div className="relative">
                {game.img ? (
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
                <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow">
                  <Star className="w-3 h-3 text-violet-500" fill="currentColor" />
                  <span className="text-[10px] font-semibold text-gray-900">{game.rating}</span>
                </div>
              </div>
              <div className="p-3 flex flex-col gap-2 flex-1">
                <div>
                  <p className="text-[10px] font-medium text-purple-500 uppercase tracking-wider">
                    {game.genre.split(',')[0]}
                  </p>
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight">{game.fullName || game.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">₹{game.price}</span>
                  <span className="text-xs text-gray-400 line-through">₹{game.originalPrice}</span>
                </div>
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={(e) => handleBuyNow(e, game)}
                    className="flex-1 bg-violet-500 hover:bg-violet-600 text-white font-semibold py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg text-[10px] sm:text-xs transition-all duration-200 cursor-pointer"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={(e) => handleAddToCart(e, game)}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg text-[10px] sm:text-xs transition-all duration-200 cursor-pointer"
                  >
                    <span className="sm:hidden">Add Cart</span>
                    <span className="hidden sm:inline">Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <button
            onClick={() => navigate('/games')}
            className="inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-200 cursor-pointer"
          >
            View All Games
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomeGamesSection
