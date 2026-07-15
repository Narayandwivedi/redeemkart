import React, { useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import { games, bundleGamesList } from '../../data/games'
import { Sparkles } from 'lucide-react'
import { useSEO } from '../../hooks/useSEO'

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

const calculateDiscount = (original, current) => {
  if (!original || original <= current) return 0
  return Math.round(((original - current) / original) * 100)
}

const bundleGames = bundleGamesList
const bundleImages = bundleGames.map((g) => g.img).filter(Boolean)

const GameDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isAuthenticated } = useContext(AppContext)

  const game = games[slug]

  useSEO({
    title: game ? `${game.fullName} | Buy AAA Games | GCHub` : 'Loading Game... | GCHub',
    description: game ? game.description?.substring(0, 160) : 'Buy popular AAA games at cheap prices on GCHub.',
    keywords: game ? `${game.name}, buy ${game.name}, cheap ${game.name}, pc games, gchub` : 'pc games, buy games, gchub',
    ogImage: game ? game.img : null,
    structuredData: game ? {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": game.fullName,
      "image": game.img,
      "description": game.description,
      "applicationCategory": "GameApplication",
      "operatingSystem": game.platform || "PC",
      "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": "INR",
        "price": game.price,
        "availability": "https://schema.org/InStock"
      }
    } : null
  })

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Game not found</h1>
          <p className="text-gray-500 mb-4">The game you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 cursor-pointer"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const discount = calculateDiscount(game.originalPrice, game.price)
  const savings = game.originalPrice - game.price

  const handleAddToCart = () => {
    if (game.isBundle) {
      addToCart({
        _id: slug,
        name: game.fullName,
        price: game.price,
        originalPrice: game.originalPrice,
        images: bundleImages,
      })
      toast.success('Bundle added to cart!')
    } else {
      addToCart({
        _id: slug,
        name: game.fullName,
        price: game.price,
        originalPrice: game.originalPrice,
        images: [game.img],
      })
      toast.success('Added to cart!')
    }
  }

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (game.isBundle) {
      addToCart({
        _id: slug,
        name: game.fullName,
        price: game.price,
        originalPrice: game.originalPrice,
        images: bundleImages,
      })
    } else {
      addToCart({
        _id: slug,
        name: game.fullName,
        price: game.price,
        originalPrice: game.originalPrice,
        images: [game.img],
      })
    }
    navigate('/checkout')
  }

  if (game.isBundle) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            <div className="relative">
              <div className="w-full aspect-square bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
                <div className="grid grid-cols-2 h-full w-full gap-0.5 p-0.5">
                  {bundleGames.map((g, i) => (
                    <img key={i} src={g.img} alt="" className="w-full h-full object-cover" />
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent rounded-2xl" />
              </div>
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-md">
                  -{discount}% OFF
                </div>
              )}
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-500" />
                <span className="text-sm font-semibold text-gray-900">Bundle</span>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <p className="text-xs font-medium text-violet-500 uppercase tracking-wider mb-1">Bundle Offer</p>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">{game.fullName}</h1>
                <p className="text-sm text-gray-500">Get {bundleGames.length} premium AAA titles at one unbeatable price</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-4xl font-black text-gray-900">{formatPrice(game.price)}</span>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(game.originalPrice)}</span>
                </div>
                <p className="text-sm font-medium text-green-600 mb-4">
                  Save {formatPrice(savings)} &mdash; Limited time offer
                </p>

                <div className="flex flex-row gap-3">
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-violet-500 hover:bg-violet-600 text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-violet-500/40 transform hover:scale-[1.02] cursor-pointer"
                  >
                    Buy Bundle
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-gray-900/30 transform hover:scale-[1.02] cursor-pointer"
                  >
                    Add Bundle
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                Get access to {bundleGames.length} of the most popular AAA games at a fraction of their original price. 
                This bundle includes action, adventure, RPG, racing and more genres to keep you entertained for hours.
              </p>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-4">Games Included in This Bundle</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {bundleGames.map((g) => (
              <div
                key={g._id}
                onClick={() => navigate(`/games/${g.slug}`)}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden cursor-pointer group"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={g.img}
                    alt={g.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-1.5">
                  <p className="text-[10px] font-medium text-gray-800 leading-tight truncate">{g.fullName || g.name}</p>
                  <p className="text-[10px] font-semibold text-gray-900">ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹{g.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="relative">
            <img
              src={game.img}
              alt={game.fullName}
              className="w-full rounded-2xl shadow-lg object-cover aspect-square"
            />
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-md">
                -{discount}% OFF
              </div>
            )}
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md flex items-center gap-1.5">
              <svg className="w-4 h-4 text-violet-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-sm font-semibold text-gray-900">{game.rating}</span>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs font-medium text-violet-500 uppercase tracking-wider mb-1">{game.genre}</p>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">{game.fullName}</h1>
              <p className="text-sm text-gray-500">{game.name}</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-4xl font-black text-gray-900">{formatPrice(game.price)}</span>
                <span className="text-lg text-gray-400 line-through">{formatPrice(game.originalPrice)}</span>
              </div>
              <p className="text-sm font-medium text-green-600 mb-4">
                Save {formatPrice(savings)} &mdash; Limited time offer
              </p>

              <div className="flex flex-row gap-3">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-violet-500 hover:bg-violet-600 text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-violet-500/40 transform hover:scale-[1.02] cursor-pointer"
                >
                  Buy Now
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-gray-900/30 transform hover:scale-[1.02] cursor-pointer"
                >
                  Add to Cart
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">{game.description}</p>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-700">{game.platform}</span>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-700">Released {game.releaseDate}</span>
              </div>
            </div>

            {game.features && game.features.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Key Features</h3>
                <ul className="space-y-1.5">
                  {game.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {game.systemRequirements && (
          <div className="mt-12 bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">System Requirements</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {Object.entries(game.systemRequirements).map(([key, value]) => (
                <div key={key}>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{key}</p>
                  <p className="text-sm font-medium text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GameDetail
