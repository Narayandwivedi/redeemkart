import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const products = [
  { name: 'Google Play', file: '/products/google%20play.avif', link: '/gift-cards/google-play' },
  { name: 'Amazon', file: '/products/amazon.avif', link: '/gift-cards/amazon' },
  { name: 'BigBasket', file: '/products/bigbasket.avif', link: '/gift-cards/bigbasket' },
  { name: 'Flipkart', file: '/products/flipkart.avif', link: '/gift-cards/flipkart' },
  { name: 'Steam', file: '/products/steam.avif', link: '/gift-cards/steam' },
  { name: 'Myntra', file: '/products/myntra.avif', link: '/gift-cards/myntra' },
]

const PopularGiftCards = () => {
  const navigate = useNavigate()
  return (
    <div className="py-4 md:py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-[28px] font-semibold text-gray-800 text-center flex-1">Popular Gift Cards</h2>
          <button
            onClick={() => navigate('/gift-cards')}
            className="hidden sm:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {products.map((product) => (
            <Link
              key={product.name}
              to={product.link}
              className="flex flex-col items-center h-full"
            >
              <img
                src={product.file}
                alt={product.name}
                className="h-28 w-28 sm:h-44 sm:w-44 object-contain"
              />
              <div className="flex-1" />
              <span className="w-28 sm:w-44 py-2 sm:py-2.5 bg-gradient-to-r from-violet-500 to-violet-600 text-white text-[10px] sm:text-xs font-semibold hover:shadow-md hover:from-violet-400 hover:to-violet-500 transition-all duration-200 text-center cursor-pointer">
                Shop Now
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <button
            onClick={() => navigate('/gift-cards')}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-200 cursor-pointer"
          >
            View All Gift Cards
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PopularGiftCards
