import React from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Facebook, Twitter } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer style={{ background: 'linear-gradient(160deg, #111 0%, #1a1200 60%, #0f0f0f 100%)' }} className="text-white">
      
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #8b5cf6, #7c3aed, #6d28d9, #8b5cf6)', backgroundSize: '200% 100%' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">

        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">

          {/* Brand Column */}
          <div>
            <Link to="/" className="flex items-center mb-2 group">
              <img src="/redeemkart-logo.png" alt="RedeemKart" className="h-[70px] w-[140px] md:h-[90px] md:w-[180px] object-contain drop-shadow-lg group-hover:scale-102 transition-transform duration-200" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              India's trusted gift card trading platform. Buy, sell and trade gift cards & digital vouchers from 100+ top brands at the best prices.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[
                { label: 'Instagram', href: 'https://www.instagram.com/redeemkart.in', icon: <Instagram className="w-4 h-4" /> },
                { label: 'Facebook', href: '#', icon: <Facebook className="w-4 h-4" /> },
                { label: 'X (Twitter)', href: '#', icon: <Twitter className="w-4 h-4" /> },
              ].map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200"
                  style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)', color: '#8b5cf6' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.3)'; e.currentTarget.style.borderColor = '#8b5cf6' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.12)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.2)' }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Categories + Quick Links in same row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Shop by Category */}
            <div>
              <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-4 h-0.5 inline-block rounded" style={{ background: '#8b5cf6' }} />
                Categories
              </h3>
              <ul className="space-y-2.5">
                {[
                  { to: '/search?category=e-commerce', label: 'ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂºÃ¢â‚¬â„¢ E-Commerce' },
                  { to: '/search?category=gaming', label: 'ÃƒÂ°Ã…Â¸Ã…Â½Ã‚Â® Gaming' },
                  { to: '/search?category=food-dining', label: 'ÃƒÂ°Ã…Â¸Ã‚ÂÃ¢â‚¬Â Food & Dining' },
                  { to: '/search?category=fashion-lifestyle', label: 'ÃƒÂ°Ã…Â¸Ã¢â‚¬ËœÃ¢â‚¬â€ Fashion & Lifestyle' },
                  { to: '/search?category=travel-entertainment', label: 'ÃƒÂ¢Ã…â€œÃ‹â€ ÃƒÂ¯Ã‚Â¸Ã‚Â Travel & Entertainment' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-gray-400 text-sm hover:text-violet-500 transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      <span className="w-0 group-hover:w-2 h-px rounded transition-all duration-200 inline-block" style={{ background: '#8b5cf6' }} />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-4 h-0.5 inline-block rounded" style={{ background: '#8b5cf6' }} />
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/about', label: 'About Us' },
                  { to: '/contact', label: 'Contact Us' },
                  { to: '/sell-voucher', label: 'Sell Gift Card' },
                  { to: '/my-orders', label: 'My Orders' },
                  { to: '/customer-support', label: 'Support' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-gray-400 text-sm hover:text-violet-500 transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      <span className="w-0 group-hover:w-2 h-px rounded transition-all duration-200 inline-block" style={{ background: '#8b5cf6' }} />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact & Trust */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-4 h-0.5 inline-block rounded" style={{ background: '#8b5cf6' }} />
              Contact Us
            </h3>
            <ul className="space-y-3 mb-5">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.12)' }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#8b5cf6' }}>
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </span>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Phone</p>
                  <a href="tel:+917000121212" className="text-gray-300 text-sm hover:text-violet-500 transition-colors">+91 70001 21212</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.12)' }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#8b5cf6' }}>
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Email</p>
                  <a href="mailto:support@redeemkart.in" className="text-gray-300 text-sm hover:text-violet-500 transition-colors">support@redeemkart.in</a>
                </div>
              </li>
            </ul>

            {/* Trust badges */}
            <div className="rounded-xl p-3 space-y-2" style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)' }}>
              {['ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ¢â‚¬â„¢ 100% Secure Payments', 'ÃƒÂ¢Ã…Â¡Ã‚Â¡ Instant Delivery', 'ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ Verified Vouchers'].map(badge => (
                <p key={badge} className="text-xs text-gray-400">{badge}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-8 pt-5 flex flex-col sm:flex-row justify-between items-center gap-3"
          style={{ borderTop: '1px solid rgba(139,92,246,0.15)' }}
        >
          <p className="text-gray-500 text-xs text-center sm:text-left">
            &copy; {currentYear} <span style={{ color: '#8b5cf6' }}>RedeemKart</span>. All rights reserved. Made in 🇮🇳 India.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/refund-policy"
              className="text-gray-500 hover:text-violet-500 text-xs transition-colors duration-200"
            >
              Refund Policy
            </Link>
            <Link
              to="/privacy-policy"
              className="text-gray-500 hover:text-violet-500 text-xs transition-colors duration-200"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
