import React, { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { useSEO } from '../hooks/useSEO'

const brandData = {
  'google-play': {
    name: 'Google Play',
    img: '/products/google%20play.avif',
    description: 'Get Google Play codes at the best prices. Instant delivery via email.',
    vouchers: [
      { _id: 'google-play-10', denom: 10, price: 8, originalPrice: 10 },
      { _id: 'google-play-50', denom: 50, price: 45, originalPrice: 50 },
      { _id: 'google-play-100', denom: 100, price: 90, originalPrice: 100 },
      { _id: 'google-play-200', denom: 200, price: 150, originalPrice: 200 },
      { _id: 'google-play-400', denom: 400, price: 349, originalPrice: 400 },
      { _id: 'google-play-520', denom: 520, price: 400, originalPrice: 520 },
      { _id: 'google-play-650', denom: 650, price: 500, originalPrice: 650, stockQuantity: 0 },
      { _id: 'google-play-799', denom: 799, price: 650, originalPrice: 799, stockQuantity: 0 },
      { _id: 'google-play-1000', denom: 1000, price: 799, originalPrice: 1000, stockQuantity: 0 },
      { _id: 'google-play-2000', denom: 2000, price: 1599, originalPrice: 2000, stockQuantity: 0 },
    ]
  },
  'amazon': {
    name: 'Amazon',
    img: '/products/amazon.avif',
    description: 'Get Amazon codes at the best prices. Instant delivery via email.',
    vouchers: [
      { _id: 'amazon-100', denom: 100, price: 88, originalPrice: 100 },
      { _id: 'amazon-500', denom: 500, price: 435, originalPrice: 500 },
      { _id: 'amazon-1000', denom: 1000, price: 870, originalPrice: 1000 },
      { _id: 'amazon-2000', denom: 2000, price: 1740, originalPrice: 2000 },
    ]
  },
  'flipkart': {
    name: 'Flipkart',
    img: '/products/flipkart.avif',
    description: 'Get Flipkart codes at the best prices. Instant delivery via email.',
    vouchers: [
      { _id: 'flipkart-100', denom: 100, price: 89, originalPrice: 100, stockQuantity: 0 },
      { _id: 'flipkart-200', denom: 200, price: 178, originalPrice: 200, stockQuantity: 0 },
      { _id: 'flipkart-500', denom: 500, price: 440, originalPrice: 500, stockQuantity: 0 },
      { _id: 'flipkart-1000', denom: 1000, price: 875, originalPrice: 1000, stockQuantity: 0 },
      { _id: 'flipkart-2000', denom: 2000, price: 1750, originalPrice: 2000, stockQuantity: 0 },
    ]
  },
  'steam': {
    name: 'Steam',
    img: '/products/steam.avif',
    description: 'Get Steam Wallet codes at the best prices. Instant delivery via email.',
    vouchers: [
      { _id: 'steam-50', denom: 50, price: 44, originalPrice: 50 },
      { _id: 'steam-100', denom: 100, price: 85, originalPrice: 100 },
      { _id: 'steam-500', denom: 500, price: 430, originalPrice: 500 },
      { _id: 'steam-1000', denom: 1000, price: 860, originalPrice: 1000 },
    ]
  },
  'myntra': {
    name: 'Myntra',
    img: '/products/myntra.avif',
    description: 'Get Myntra codes at the best prices. Instant delivery via email.',
    vouchers: [
      { _id: 'myntra-500', denom: 500, price: 440, originalPrice: 500 },
      { _id: 'myntra-1000', denom: 1000, price: 875, originalPrice: 1000 },
      { _id: 'myntra-2000', denom: 2000, price: 1750, originalPrice: 2000 },
    ]
  },
  'bigbasket': {
    name: 'BigBasket',
    img: '/products/bigbasket.avif',
    description: 'Get BigBasket codes at the best prices. Instant delivery via email.',
    vouchers: [
      { _id: 'bigbasket-100', denom: 100, price: 88, originalPrice: 100 },
      { _id: 'bigbasket-500', denom: 500, price: 435, originalPrice: 500 },
      { _id: 'bigbasket-1000', denom: 1000, price: 870, originalPrice: 1000 },
    ]
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(price)
}

const calculateDiscount = (original, current) => {
  if (!original || original <= current) return 0
  return Math.round(((original - current) / original) * 100)
}

const GiftCardDetail = () => {
  const { brand } = useParams()
  const navigate = useNavigate()
  const { addToCart, items } = useCart()
  const { isAuthenticated, BACKEND_URL } = useContext(AppContext)
  
  const [selectedDenom, setSelectedDenom] = useState(null)
  const [fetchedVouchers, setFetchedVouchers] = useState([])
  const [loading, setLoading] = useState(true)

  const brandInfo = brandData[brand]

  useEffect(() => {
    const fetchVouchers = async () => {
      if (!brandInfo) return
      try {
        const response = await fetch(`${BACKEND_URL}/api/products/category/gift-cards?brand=${brandInfo.name}&limit=50`)
        const data = await response.json()
        if (data.success && data.data.length > 0) {
          const mappedVouchers = data.data.map(v => ({
            ...v,
            denom: v.originalPrice || v.price
          }))
          const sorted = mappedVouchers.sort((a, b) => a.price - b.price)
          setFetchedVouchers(sorted)
        }
      } catch (error) {
        console.error('Error fetching vouchers:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchVouchers()
  }, [brandInfo, BACKEND_URL])

  const vouchers = fetchedVouchers.length > 0 ? fetchedVouchers : (brandInfo?.vouchers || [])
  const selected = vouchers.find(v => v.denom === selectedDenom) || vouchers[0]
  const discountPercent = calculateDiscount(selected?.originalPrice, selected?.price)
  const savings = selected ? selected.originalPrice - selected.price : 0

  const handleVariantClick = (v) => {
    if (v.stockQuantity === 0) {
      toast.error('Out of stock')
      return
    }
    setSelectedDenom(v.denom)
  }

  const handleAddToCart = () => {
    if (!selected || selected.stockQuantity === 0) {
      toast.error('Out of stock')
      return
    }
    
    // Use the backend product structure if available, otherwise fallback
    const cartItemData = fetchedVouchers.length > 0 ? selected : {
      ...selected,
      name: `${brandInfo?.name} Gift Card - \u20B9${selected.denom}`,
      images: [brandInfo?.img],
    }

    const maxLimit = cartItemData.maxAddCartItem ?? 4;
    if (maxLimit !== null) {
      const existingItem = items.find(i => (i._id || i.id) === (cartItemData._id || cartItemData.id));
      if (existingItem && existingItem.quantity >= maxLimit) {
        toast.warn(`You can only add ${maxLimit} of this item.`);
        return;
      }
    }

    addToCart(cartItemData)
    toast.success('Added to cart!')
  }

  const handleBuyNow = () => {
    if (!selected || selected.stockQuantity === 0) return
    
    const cartItemData = fetchedVouchers.length > 0 ? selected : {
      ...selected,
      name: `${brandInfo?.name} Gift Card - \u20B9${selected.denom}`,
      images: [brandInfo?.img],
    }

    const maxLimit = cartItemData.maxAddCartItem ?? 4;
    if (maxLimit !== null) {
      const existingItem = items.find(i => (i._id || i.id) === (cartItemData._id || cartItemData.id));
      if (existingItem && existingItem.quantity >= maxLimit) {
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
    addToCart(cartItemData)
    navigate('/checkout')
  }

  useSEO({
    title: `${brandInfo?.name} Gift Cards | Buy Online & Save | GCHub`,
    description: brandInfo?.description || 'Gift cards at best prices',
    keywords: `buy ${brandInfo?.name} gift card, ${brandInfo?.name} voucher`,
  })

  if (!brandInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/40 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Brand not found</h2>
          <Link to="/gift-cards" className="text-amber-600 hover:underline font-semibold">Browse all gift cards</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors mb-6 font-medium text-sm cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="bg-slate-100 flex items-center justify-center p-8 sm:p-12 lg:p-16">
              <img src={brandInfo.img} alt={brandInfo.name} className="w-full max-w-xs sm:max-w-sm object-contain" />
            </div>

            <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
              <div className="mb-6">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Gift Card</p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-800 mb-3">
                  {brandInfo.name}
                </h1>
                <p className="text-sm sm:text-base text-slate-500">{brandInfo.description}</p>
              </div>

              <div className="mb-6">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Select Denomination</p>
                <div className="relative">
                  <div className="flex flex-nowrap gap-2.5 overflow-x-auto pb-2 scrollbar-thin pe-6">
                    {vouchers.map((v) => {
                      const isSelected = (selected?._id === v._id)
                      const isOos = v.stockQuantity === 0
                      return (
                        <button
                          key={v._id}
                          onClick={() => handleVariantClick(v)}
                          disabled={isOos}
                          className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all duration-200 cursor-pointer ${
                            isOos
                              ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed line-through'
                              : isSelected
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50'
                          }`}
                        >
                          {'\u20B9'}{v.denom}
                          {isOos && <span className="block text-[10px] font-normal normal-case">Out of stock</span>}
                        </button>
                      )
                    })}
                  </div>
                  <div className="absolute right-0 top-0 bottom-2 w-10 bg-gradient-to-l from-white via-white/90 to-transparent pointer-events-none sm:hidden"></div>
                </div>
              </div>

              {selected && selected.stockQuantity !== 0 && (
                <>
                  <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 mb-6 border border-slate-100">
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                        {formatPrice(selected.price)}
                      </span>
                      {selected.originalPrice > selected.price && (
                        <span className="text-lg sm:text-xl text-slate-400 line-through">
                          {formatPrice(selected.originalPrice)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                      <span>You save {formatPrice(savings)} ({discountPercent}% OFF)</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={handleBuyNow} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer text-sm">
                      Buy Now
                    </button>
                    <button onClick={handleAddToCart} className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer text-sm">
                      Add to Cart
                    </button>
                  </div>
                </>
              )}

              {selected?.stockQuantity === 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
                  <p className="text-red-700 font-bold">This denomination is currently out of stock</p>
                  <p className="text-red-500 text-sm mt-1">Please select another option</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                  <span>Instant digital delivery via email</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GiftCardDetail
