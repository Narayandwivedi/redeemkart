import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Gamepad2, Star, Sparkles } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import { gamesList, games, bundleGameSlugs } from '../../data/games'

const GamesPage = () => {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [search, setSearch] = useState('')

  const filtered = search
    ? gamesList.filter(
        (g) =>
          g.name.toLowerCase().includes(search.toLowerCase()) ||
          g.fullName.toLowerCase().includes(search.toLowerCase()) ||
          g.genre.toLowerCase().includes(search.toLowerCase())
      )
    : gamesList

  const allGameImages = bundleGameSlugs.map((slug) => games[slug]?.img).filter(Boolean)

  const handleAddToCart = (e, game) => {
    e.stopPropagation()
    if (game.isBundle) {
      addToCart({
        _id: game._id,
        name: game.fullName,
        price: game.price,
        originalPrice: game.originalPrice,
        images: allGameImages,
      })
      toast.success('Game bundle added to cart!')
    } else {
      addToCart({
        _id: game._id,
        name: game.fullName,
        price: game.price,
        originalPrice: game.originalPrice,
        images: [game.img],
      })
      toast.success(`${game.name} added to cart!`)
    }
  }

  const handleBuyNow = (e, game) => {
    e.stopPropagation()
    if (game.isBundle) {
      addToCart({
        _id: game._id,
        name: game.fullName,
        price: game.price,
        originalPrice: game.originalPrice,
        images: allGameImages,
      })
    } else {
      addToCart({
        _id: game._id,
        name: game.fullName,
        price: game.price,
        originalPrice: game.originalPrice,
        images: [game.img],
      })
    }
    navigate('/cart')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1 flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
              All Games
            </h1>
            <p className="text-sm text-gray-500">
              {filtered.length} {filtered.length === 1 ? 'game' : 'games'} available right now
            </p>
          </div>
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, genre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-24 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm outline-none transition-all bg-white"
            />
            <button className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-1.5 rounded-lg transition-colors text-sm shadow-sm flex items-center gap-1">
              Search
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Gamepad2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-1">No games found</h3>
            <p className="text-gray-400 text-sm">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {filtered.map((game) => (
              <div
                key={game._id}
                onClick={() => navigate(`/games/${game.slug}`)}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200 relative group flex flex-col cursor-pointer hover:-translate-y-1"
              >
                <div className="relative">
                  {game.isBundle ? (
                    <div className="w-full aspect-square bg-gray-900 overflow-hidden">
                      <div className="grid grid-cols-2 h-full w-full gap-0.5 p-0.5">
                        {allGameImages.map((src, i) => (
                          <img
                            key={i}
                            src={src}
                            alt=""
                            className="w-full h-full object-cover"
                          />
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
                  {!game.isBundle && (
                    <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow">
                      <Star className="w-3 h-3 text-yellow-500" fill="currentColor" />
                      <span className="text-[10px] font-semibold text-gray-900">{game.rating}</span>
                    </div>
                  )}
                </div>
                <div className="p-3 flex flex-col gap-2 flex-1">
                  <div>
                    {!game.isBundle && (
                      <p className="text-[10px] font-medium text-purple-500 uppercase tracking-wider">
                        {game.genre.split(',')[0]}
                      </p>
                    )}
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">{game.fullName || game.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">₹{game.price}</span>
                    <span className="text-xs text-gray-400 line-through">₹{game.originalPrice}</span>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={(e) => handleBuyNow(e, game)}
                      className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg text-[10px] sm:text-xs transition-all duration-200 cursor-pointer"
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
        )}
      </div>
    </div>
  )
}

export default GamesPage
