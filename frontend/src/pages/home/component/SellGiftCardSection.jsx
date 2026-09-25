import React from 'react'
import { Link } from 'react-router-dom'
import { Clock, ArrowRight } from 'lucide-react'

const sellBrands = [
  { name: 'Google Play', file: '/products/google%20play.avif' },
  { name: 'Amazon', file: '/products/amazon.avif' },
  { name: 'Flipkart', file: '/products/flipkart.avif' },
  { name: 'Myntra', file: '/products/myntra.avif' },
  { name: 'BigBasket', file: '/products/bigbasket.avif' },
  { name: 'Steam', file: '/products/steam.avif' },
]

const SellGiftCardSection = () => (
  <section className="px-3 sm:px-6 lg:px-8 py-3 font-['Inter',sans-serif]">
    <div className="max-w-7xl mx-auto relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 shadow-md">
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />

      <div className="relative flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 px-4 sm:px-7 py-4 sm:py-5">
        <div className="text-white lg:flex-1 min-w-0">
          <span className="inline-flex items-center gap-1.5 bg-white/15 text-[11px] sm:text-xs font-medium px-2.5 py-1 rounded-full mb-2">
            <Clock className="w-3.5 h-3.5" /> Payment in 3-4 hours
          </span>
          <h2 className="font-['Poppins',sans-serif] text-lg sm:text-2xl font-semibold tracking-tight leading-snug">
            Sell your unused gift cards for cash
          </h2>
          <p className="text-[13px] sm:text-sm text-emerald-50/85 mt-1 leading-relaxed">
            Google Play, Amazon, Flipkart and more. Money goes straight to your bank account.
          </p>
        </div>

        <div className="grid grid-cols-6 gap-2 lg:w-[360px] shrink-0">
          {sellBrands.map((b) => (
            <Link
              key={b.name}
              to="/sell-gift-card"
              className="bg-white rounded-lg p-1 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <img src={b.file} alt={`Sell ${b.name} gift card`} className="w-full h-auto object-contain block rounded" loading="lazy" />
            </Link>
          ))}
        </div>

        <Link
          to="/sell-gift-card"
          className="group inline-flex items-center justify-center gap-2 shrink-0 bg-amber-400 hover:bg-amber-300 text-slate-900 text-sm font-semibold px-6 py-2.5 rounded-lg shadow-sm transition-colors"
        >
          Sell Gift Card
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  </section>
)

export default SellGiftCardSection
