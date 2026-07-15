import React from 'react'
import { Gift, Gamepad2, Banknote, ShieldCheck, Zap, Users, ArrowRightLeft, BadgePercent, CreditCard, Repeat, Wallet } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'

const About = () => {
  useSEO({
    title: 'About RedeemKart | India\'s Trusted Gift Card Trading Platform',
    description: 'Learn about RedeemKart, India\'s premier gift card trading platform. Sell unused gift cards for cash and buy discounted vouchers from top brands.',
    keywords: 'about RedeemKart, gift card trading, sell gift cards online, buy discounted gift cards, voucher marketplace india'
  })

  const stats = [
    { label: 'Active Traders', value: '10K+' },
    { label: 'Gift Cards Sold', value: '50K+' },
    { label: 'Brands Listed', value: '100+' },
    { label: 'Cash Payouts', value: '₹2Cr+' },
  ]

  const features = [
    {
      icon: Gift,
      title: 'Sell Unused Gift Cards',
      desc: 'Got a gift card you will never use? List it on RedeemKart and turn it into real cash instantly. We support all major brands.',
      color: 'bg-blue-50 text-blue-500',
    },
    {
      icon: CreditCard,
      title: 'Buy Gift Cards at Discount',
      desc: 'Purchase gift cards from top brands like Amazon, Flipkart, Google Play, and more at prices below face value. Every deal saves you money.',
      color: 'bg-green-50 text-green-500',
    },
    {
      icon: Wallet,
      title: 'Instant Cash Payouts',
      desc: 'Once your gift card sells, the money is transferred directly to your bank account — no hidden fees, no delays, no hassle.',
      color: 'bg-violet-50 text-violet-600',
    },
    {
      icon: ShieldCheck,
      title: '100% Secure Trading',
      desc: 'Every transaction is verified and protected. We validate all gift card codes so both buyers and sellers trade with complete confidence.',
      color: 'bg-purple-50 text-purple-500',
    },
    {
      icon: Repeat,
      title: 'Peer-to-Peer Marketplace',
      desc: 'RedeemKart connects people with unused gift cards to buyers looking for discounts. A win-win marketplace for everyone.',
      color: 'bg-red-50 text-red-500',
    },
    {
      icon: Zap,
      title: 'Instant Digital Delivery',
      desc: 'Buy a gift card or voucher? Get the code delivered to your account in seconds. No waiting, no shipping, no hassle.',
      color: 'bg-violet-50 text-violet-500',
    },
  ]

  const steps = [
    { num: '01', title: 'List Your Gift Card', desc: 'Enter the gift card code, its value, and your selling price. We verify and publish it on the marketplace within minutes.' },
    { num: '02', title: 'Get Matched with a Buyer', desc: 'Thousands of buyers browse RedeemKart daily. Once a buyer purchases your gift card, you get notified instantly.' },
    { num: '03', title: 'Withdraw Cash to Your Bank', desc: 'The amount is credited to your RedeemKart wallet. Withdraw it to your bank account with just a few clicks — no minimum balance required.' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-px w-12 sm:w-20 bg-gray-300"></span>
            <div className="bg-violet-500 p-3 rounded-xl">
              <Gift className="w-6 h-6 text-black" />
            </div>
            <span className="h-px w-12 sm:w-20 bg-gray-300"></span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-semibold text-gray-900 mb-4">
            About <span className="text-violet-500">RedeemKart</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            India's trusted <strong>gift card trading platform</strong> — sell your unwanted gift cards for instant cash, or buy discounted vouchers from 100+ top brands.
          </p>
        </div>

        {/* What is RedeemKart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            What is <span className="text-violet-500">RedeemKart</span>?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            RedeemKart is India's premier <strong>gift card trading platform</strong> where you can sell your unused gift cards, vouchers, and digital codes for real cash — directly deposited into your bank account. At the same time, it is a marketplace for smart shoppers to buy gift cards and vouchers from top brands at prices below face value.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Whether you received an Amazon gift card you do not need, want to grab a discounted Flipkart voucher, or are looking for the best deal on Google Play codes — RedeemKart makes gift card trading fast, safe, and rewarding.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 text-center">
              <p className="text-2xl sm:text-3xl font-semibold text-violet-500">{s.value}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* How It Works — For Sellers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-50 p-2.5 rounded-lg">
              <Banknote className="w-6 h-6 text-green-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              How Selling <span className="text-violet-500">Works</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-12 h-12 bg-violet-500 text-white font-semibold rounded-xl flex items-center justify-center mx-auto mb-3 text-sm">
                  {s.num}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose RedeemKart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-violet-50 p-2.5 rounded-lg">
              <BadgePercent className="w-6 h-6 text-violet-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Why Choose <span className="text-violet-500">RedeemKart</span>?
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className={`${f.color} p-2.5 rounded-lg shrink-0`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-2xl p-6 sm:p-10 text-center">
          <Users className="w-10 h-10 text-black mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-semibold text-black mb-3">Our Mission</h2>
          <p className="text-sm sm:text-base text-black/80 max-w-2xl mx-auto leading-relaxed">
            We believe no gift card should go to waste and no smart shopper should pay full price. 
            RedeemKart makes gift card trading simple, secure, and accessible — turning unused 
            gift cards into real value for everyone.
          </p>
        </div>

      </div>
    </div>
  )
}

export default About