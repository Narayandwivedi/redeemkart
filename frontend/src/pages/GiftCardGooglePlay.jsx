import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { useSEO } from '../hooks/useSEO'

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

const GiftCardGooglePlay = () => {
  const { addToCart, items } = useCart()
  const { isAuthenticated, BACKEND_URL } = useContext(AppContext)
  const navigate = useNavigate()
  
  const [vouchers, setVouchers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/products/category/gift-cards?brand=Google Play&limit=50`)
        const data = await response.json()
        if (data.success) {
          // Hide vouchers that are sold out / paid out to sellers (no stock left)
          const available = data.data.filter(v => v.stockQuantity > 0)
          // Sort vouchers by price ascending
          const sorted = available.sort((a, b) => a.price - b.price)
          setVouchers(sorted)
        }
      } catch (error) {
        console.error('Error fetching vouchers:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchVouchers()
  }, [BACKEND_URL])

  useSEO({
    title: 'Google Play Gift Cards | Buy Online & Save | RedeemKart',
    description: 'Get Google Play gift card codes instantly on RedeemKart. Save up to 20% on Google Play vouchers with instant digital delivery via email.',
    keywords: 'buy google play gift card, google play voucher, cheap google play codes, google play redeem codes, RedeemKart',
    ogImage: 'https://redeemkart.in/redeemkart-logo.png',
    canonicalUrl: 'https://redeemkart.in/gift-cards/google-play',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Google Play Gift Cards on RedeemKart",
      "numberOfItems": vouchers.length,
      "itemListElement": vouchers.map((v, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": v.seoTitle || v.name,
          "description": v.description,
          "offers": {
            "@type": "Offer",
            "priceCurrency": "INR",
            "price": v.price,
            "availability": v.stockQuantity === 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"
          }
        }
      }))
    }
  })

  const handleAddToCart = (voucher) => {
    if (voucher.stockQuantity <= 0) {
      toast.error('Out of stock')
      return
    }
    const maxLimit = voucher.maxAddCartItem ?? 4;
    if (maxLimit !== null) {
      const cartItem = items.find(i => (i._id || i.id) === (voucher._id || voucher.id));
      if (cartItem && cartItem.quantity >= maxLimit) {
        toast.warn(`You can only add ${maxLimit} of this item.`);
        return;
      }
    }
    addToCart(voucher)
    toast.success('Added to cart!')
  }

  const handleBuyNow = (voucher) => {
    if (voucher.stockQuantity <= 0) return
    const maxLimit = voucher.maxAddCartItem ?? 4;
    if (maxLimit !== null) {
      const cartItem = items.find(i => (i._id || i.id) === (voucher._id || voucher.id));
      if (cartItem && cartItem.quantity >= maxLimit) {
        toast.warn(`You can only add ${maxLimit} of this item.`);
        if (!isAuthenticated) navigate('/login')
        else navigate('/checkout')
        return;
      }
    }
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    addToCart(voucher)
    navigate('/checkout')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl lg:text-4xl font-black text-slate-800 mb-4">
            Google Play{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
              Gift Cards
            </span>
          </h1>

          <p className="text-base sm:text-base text-slate-500 max-w-2xl mx-auto">
            Get Google Play codes at the best prices. Instant delivery via email.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {loading ? (
            <div className="col-span-full flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          ) : vouchers.length === 0 ? (
            <div className="col-span-full text-center text-slate-500 py-10">
              No Google Play Gift Cards available right now.
            </div>
          ) : (
            vouchers.map((voucher) => {
              const discountPercent = calculateDiscount(voucher.originalPrice, voucher.price)
              const savings = voucher.originalPrice - voucher.price

            return (
              <div
                key={voucher._id}
                onClick={() => navigate('/gift-card/google-play/detail')}
                className="group relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-200/50 transition-all duration-300 flex flex-col cursor-pointer"
              >
                {discountPercent > 0 && (
                  <div className="absolute top-3 left-3 z-10">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2 py-0.5 rounded-full text-[10px] font-semibold shadow-sm">
                      -{discountPercent}% OFF
                    </div>
                  </div>
                )}

                <div className="aspect-[4/3] sm:aspect-[1.6/1] w-full overflow-hidden bg-slate-100 flex items-center justify-center relative">
                  <img
                    src={voucher.images?.[0] || '/products/google%20play.avif'}
                    alt={voucher.seoTitle || voucher.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${voucher.stockQuantity === 0 ? 'from-slate-900/80 via-slate-900/20' : 'from-black/40 via-transparent'} to-transparent`}></div>
                  
                  {voucher.stockQuantity === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="bg-slate-900/80 text-white px-4 py-2 rounded-lg font-semibold tracking-wider uppercase shadow-xl transform border border-slate-700">
                        Out of Stock
                      </div>
                    </div>
                  ) : (
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 shadow-sm hidden sm:flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      Instant
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1 text-sm sm:text-base leading-tight group-hover:text-emerald-600 transition-colors">
                      {voucher.seoTitle || voucher.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] sm:text-xs tracking-wider font-bold text-emerald-600 uppercase">
                        Google Play Code
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-col gap-1 border-t border-slate-100 pt-3 mb-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg sm:text-xl font-bold text-slate-900">
                          {formatPrice(voucher.price)}
                        </span>
                        {voucher.originalPrice > voucher.price && (
                          <span className="text-xs sm:text-sm text-slate-400 line-through">
                            {formatPrice(voucher.originalPrice)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-[10px] sm:text-xs">
                        <span>Save {formatPrice(savings)} ({discountPercent}%)</span>
                      </div>
                    </div>

                    {voucher.stockQuantity === 0 ? (
                      <div className="flex flex-col gap-2">
                        <button
                          disabled
                          className="w-full bg-slate-200 text-slate-500 font-semibold py-2.5 px-4 rounded-lg cursor-not-allowed text-xs sm:text-sm flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Out of Stock
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleBuyNow(voucher) }}
                          className="w-full bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer text-xs sm:text-sm"
                        >
                          Buy Now
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAddToCart(voucher) }}
                          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer text-xs sm:text-sm"
                        >
                          Add to Cart
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default GiftCardGooglePlay
