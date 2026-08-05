import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Gift, ShoppingCart } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { toast } from 'react-toastify'
import { giftCardsList } from '../../data/giftCards'
import { useSEO } from '../../hooks/useSEO'

const GiftCardsPage = () => {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [search, setSearch] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')

  useSEO({
    title: 'Buy Gift Cards Online at Best Price | Amazon, Flipkart, Google Play | RedeemKart',
    description: 'Browse and buy discounted gift cards online in India. Shop Amazon, Flipkart, Google Play, Steam, Myntra & BigBasket gift cards at below face value prices on RedeemKart.',
    keywords: 'buy gift cards online india, discounted gift cards, amazon gift card, flipkart voucher, google play gift card, steam gift card, myntra voucher, bigbasket gift card',
    ogImage: 'https://redeemkart.in/redeemkart-logo.png',
    canonicalUrl: 'https://redeemkart.in/gift-cards',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Gift Cards Available on RedeemKart",
      "description": "Buy discounted gift cards from top Indian and international brands on RedeemKart.",
      "url": "https://redeemkart.in/gift-cards",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Google Play Gift Card", "url": "https://redeemkart.in/gift-cards/google-play" },
        { "@type": "ListItem", "position": 2, "name": "Amazon Gift Card", "url": "https://redeemkart.in/gift-cards/amazon" },
        { "@type": "ListItem", "position": 3, "name": "Flipkart Gift Card", "url": "https://redeemkart.in/gift-cards/flipkart" },
        { "@type": "ListItem", "position": 4, "name": "Steam Gift Card", "url": "https://redeemkart.in/gift-cards/steam" },
        { "@type": "ListItem", "position": 5, "name": "Myntra Gift Card", "url": "https://redeemkart.in/gift-cards/myntra" },
        { "@type": "ListItem", "position": 6, "name": "BigBasket Gift Card", "url": "https://redeemkart.in/gift-cards/bigbasket" }
      ]
    }
  })

  const brands = [...new Set(giftCardsList.map((g) => g.brand))]

  let filtered = selectedBrand
    ? giftCardsList.filter((g) => g.brand === selectedBrand)
    : giftCardsList

  if (search) {
    filtered = filtered.filter(
      (g) =>
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.fullName.toLowerCase().includes(search.toLowerCase()) ||
        g.brand.toLowerCase().includes(search.toLowerCase())
    )
  }

  const handleAddToCart = (e, card) => {
    e.stopPropagation()
    addToCart({
      _id: card._id,
      name: card.fullName,
      price: card.price,
      originalPrice: card.originalPrice,
      images: [card.img],
    })
    toast.success(`${card.brand} added to cart!`)
  }

  const handleBuyNow = (e, card) => {
    e.stopPropagation()
    addToCart({
      _id: card._id,
      name: card.fullName,
      price: card.price,
      originalPrice: card.originalPrice,
      images: [card.img],
    })
    navigate('/cart')
  }

  const discountPercent = (original, price) => {
    if (!original || original <= price) return 0
    return Math.round(((original - price) / original) * 100)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Header row ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â same structure as GamesPage */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1 flex items-center gap-2">
              <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-violet-500" />
              Gift Cards
            </h1>
            <p className="text-sm text-gray-500">
              {filtered.length} {filtered.length === 1 ? 'card' : 'cards'} available at discounted prices
            </p>
          </div>

          {/* Search bar ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â same structure as GamesPage */}
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-24 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm outline-none transition-all bg-white"
            />
            <button className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-violet-500 hover:bg-violet-600 text-white font-semibold px-4 py-1.5 rounded-lg transition-colors text-sm shadow-sm flex items-center gap-1 cursor-pointer">
              Search
            </button>
          </div>
        </div>

        {/* Brand filter chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedBrand('')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 cursor-pointer ${
              selectedBrand === ''
                ? 'bg-violet-500 border-violet-500 text-white shadow-sm'
                : 'bg-white border-gray-200 text-gray-600 hover:border-violet-500 hover:text-violet-700'
            }`}
          >
            All Brands
          </button>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBrand(selectedBrand === b ? '' : b)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 cursor-pointer ${
                selectedBrand === b
                  ? 'bg-violet-500 border-violet-500 text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-violet-500 hover:text-violet-700'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* Cards grid ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â same structure as GamesPage */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-1">No gift cards found</h3>
            <p className="text-gray-400 text-sm">Try a different search or brand filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {filtered.map((card) => {
              const discount = discountPercent(card.originalPrice, card.price)
              return (
                <div
                  key={card._id}
                  onClick={() => navigate(`/gift-card/${card.brand.toLowerCase().replace(/\s+/g, '-')}/detail`)}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200 relative group flex flex-col hover:-translate-y-1 cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative">
                    <div className="w-full aspect-square bg-slate-100 flex items-center justify-center p-6">
                      <img
                        src={card.img}
                        alt={card.brand}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md">
                        -{discount}% OFF
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 flex flex-col gap-2 flex-1">
                    <div>
                      <p className="text-[10px] font-medium text-violet-700 uppercase tracking-wider">
                        {card.brand}
                      </p>
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">{card.name}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">₹{card.price}</span>
                      {card.originalPrice > card.price && (
                        <span className="text-xs text-gray-400 line-through">₹{card.originalPrice}</span>
                      )}
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={(e) => handleBuyNow(e, card)}
                        className="flex-1 bg-violet-500 hover:bg-violet-600 text-white font-semibold py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg text-[10px] sm:text-xs transition-all duration-200 cursor-pointer"
                      >
                        Buy Now
                      </button>
                      <button
                        onClick={(e) => handleAddToCart(e, card)}
                        className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg text-[10px] sm:text-xs transition-all duration-200 cursor-pointer"
                      >
                        <span className="sm:hidden">Add</span>
                        <span className="hidden sm:inline">Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default GiftCardsPage
