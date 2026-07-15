import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const fallbackVouchers = [
  {
    _id: 'amazon-deal',
    seoTitle: "Amazon Pay e-Gift Card - Min 5% Cashback",
    price: 950,
    originalPrice: 1000,
    brand: "Amazon",
    category: "e-commerce",
    images: ["https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&q=80&w=600"],
  },
  {
    _id: 'googleplay-deal',
    seoTitle: "Google Play Gift Card - â‚¹500 digital code",
    price: 475,
    originalPrice: 500,
    brand: "Google Play",
    category: "gaming",
    images: ["https://images.unsplash.com/photo-1576402187878-974f70c890a5?auto=format&fit=crop&q=80&w=600"],
  },
  {
    _id: 'steam-deal',
    seoTitle: "Steam Wallet Code - â‚¹1000 Digital Code",
    price: 960,
    originalPrice: 1000,
    brand: "Steam",
    category: "gaming",
    images: ["https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?auto=format&fit=crop&q=80&w=600"],
  },
  {
    _id: 'spotify-deal',
    seoTitle: "Spotify Premium 12-Month Subscription Voucher",
    price: 1099,
    originalPrice: 1189,
    brand: "Spotify",
    category: "travel-entertainment",
    images: ["https://images.unsplash.com/photo-1614680376593-902f74fa0d41?auto=format&fit=crop&q=80&w=600"],
  }
]

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

const TopDealsSection = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
        const res = await axios.get(`${backendUrl}/api/products`)
        if (res.data && res.data.success && res.data.data.length > 0) {
          // Filter products with a discount or featured ones
          const deals = res.data.data.filter(p => p.originalPrice > p.price).slice(0, 4)
          setProducts(deals.length > 0 ? deals : res.data.data.slice(0, 4))
        } else {
          setProducts(fallbackVouchers)
        }
      } catch (err) {
        console.error("Failed to fetch deals, using fallback", err)
        setProducts(fallbackVouchers)
      } finally {
        setLoading(false)
      }
    }
    fetchDeals()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-2 text-slate-500">Loading today's deals...</p>
      </div>
    )
  }

  return (
    <section className="py-12 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/40">
      <div className="max-w-[86rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full mb-4">
            <span className="text-white text-sm font-medium">Today's Hot Offers</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-black text-slate-800 mb-3">
            Top Discounted <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Vouchers</span>
          </h2>

          <p className="text-base text-slate-500 max-w-2xl mx-auto">
            Grab premium gift cards and wallet codes at discount rates. Delivered instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const discountPercent = calculateDiscount(product.originalPrice, product.price)
            const imageUrl = product.images?.[0] || 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&q=80&w=600'

            return (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group relative transition-all duration-300 bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:border-violet-300 hover:shadow-2xl hover:shadow-violet-200/50 flex flex-col justify-between"
              >
                {discountPercent > 0 && (
                  <div className="absolute top-3 left-3 z-10">
                    <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-md">
                      -{discountPercent}% OFF
                    </div>
                  </div>
                )}

                <div className="aspect-[1.6/1] w-full overflow-hidden bg-slate-100 flex items-center justify-center relative">
                  <img
                    src={imageUrl}
                    alt={product.seoTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80"></div>
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 shadow-sm">
                    {product.brand}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] tracking-wider font-bold text-indigo-600 uppercase mb-1 block">
                      {product.category?.replace('-', ' & ')}
                    </span>
                    <h3 className="font-semibold text-slate-800 mb-3 text-base leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {product.seoTitle}
                    </h3>
                  </div>

                  <div>
                    <div className="flex items-end justify-between border-t border-slate-100 pt-3">
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-slate-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-slate-400 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      {product.originalPrice > product.price && (
                        <span className="text-emerald-600 font-semibold text-xs bg-emerald-50 px-2 py-1 rounded-md">
                          Save {formatPrice(product.originalPrice - product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TopDealsSection
