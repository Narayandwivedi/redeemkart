import React from 'react'
import { Gift, Gamepad2, Banknote, ShieldCheck, Zap, Users, ArrowRightLeft, BadgePercent } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'

const About = () => {
  useSEO({
    title: 'About GCHub | India\'s Trusted Gift Card & Voucher Marketplace',
    description: 'Learn about GCHub, India\'s premier peer-to-peer gift card marketplace. Sell unused vouchers for cash and buy gift cards & games at discounts.',
    keywords: 'about GCHub, how to sell gift cards, buy cheap games, gift card marketplace india'
  })

  const stats = [
    { label: 'Active Users', value: '10K+' },
    { label: 'Vouchers Sold', value: '50K+' },
    { label: 'Games Listed', value: '5K+' },
    { label: 'Cash Payouts', value: '₹2Cr+' },
  ]

  const features = [
    {
      icon: Gift,
      title: 'Sell Unused Vouchers',
      desc: 'Got a gift card or voucher you will never use? List it on GCHub and turn it into real cash instantly.',
      color: 'bg-blue-50 text-blue-500',
    },
    {
      icon: Gamepad2,
      title: 'Buy Games at Discount',
      desc: 'Get your favorite games and gift cards at prices lower than retail. Every deal is a steal on GCHub.',
      color: 'bg-green-50 text-green-500',
    },
    {
      icon: Banknote,
      title: 'Cash in Your Bank',
      desc: 'Once your voucher sells, the money is transferred directly to your bank account — no hidden fees, no delays.',
      color: 'bg-amber-50 text-amber-500',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Transactions',
      desc: 'Every transaction is protected. We verify all vouchers and codes so buyers and sellers trade with confidence.',
      color: 'bg-purple-50 text-purple-500',
    },
    {
      icon: Zap,
      title: 'Instant Delivery',
      desc: 'Buy a game or voucher? Get the code delivered to your account in seconds. No waiting, no hassle.',
      color: 'bg-yellow-50 text-yellow-500',
    },
    {
      icon: ArrowRightLeft,
      title: 'Peer-to-Peer Marketplace',
      desc: 'GCHub connects people who have unused vouchers with people who want them — a win-win for everyone.',
      color: 'bg-red-50 text-red-500',
    },
  ]

  const steps = [
    { num: '01', title: 'List Your Voucher', desc: 'Enter the voucher code, its value, and your selling price. We will verify and list it on the marketplace.' },
    { num: '02', title: 'Get Matched with a Buyer', desc: 'Thousands of buyers browse GCHub daily. Once someone purchases your voucher, you get notified instantly.' },
    { num: '03', title: 'Receive Cash in Your Bank', desc: 'The amount is credited to your GCHub wallet. Withdraw it to your bank account with just a few clicks.' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-px w-12 sm:w-20 bg-gray-300"></span>
            <div className="bg-yellow-400 p-3 rounded-xl">
              <Gift className="w-6 h-6 text-black" />
            </div>
            <span className="h-px w-12 sm:w-20 bg-gray-300"></span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-semibold text-gray-900 mb-4">
            About <span className="text-yellow-500">GCHub</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            India's trusted marketplace to <strong>sell unused vouchers for cash</strong> and{' '}
            <strong>buy games & gift cards at discounted prices</strong>.
          </p>
        </div>

        {/* What is GCHub */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            What is <span className="text-yellow-500">GCHub</span>?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            GCHub is a peer-to-peer platform where you can sell your unused gift cards, vouchers, and game codes 
            for real cash — directly deposited into your bank account. At the same time, it is a marketplace for 
            gamers and shoppers to buy games, gift cards, and vouchers at prices below market rate.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Whether you received a gift card you do not need or want to grab the latest game without burning 
            a hole in your pocket, GCHub makes it fast, safe, and simple.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 text-center">
              <p className="text-2xl sm:text-3xl font-semibold text-yellow-500">{s.value}</p>
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
              How Selling <span className="text-yellow-500">Works</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-12 h-12 bg-yellow-400 text-black font-semibold rounded-xl flex items-center justify-center mx-auto mb-3 text-sm">
                  {s.num}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose GCHub */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-yellow-50 p-2.5 rounded-lg">
              <BadgePercent className="w-6 h-6 text-yellow-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Why Choose <span className="text-yellow-500">GCHub</span>?
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
        <div className="bg-gradient-to-r from-amber-400 to-yellow-500 rounded-2xl p-6 sm:p-10 text-center">
          <Users className="w-10 h-10 text-black mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-semibold text-black mb-3">Our Mission</h2>
          <p className="text-sm sm:text-base text-black/80 max-w-2xl mx-auto leading-relaxed">
            We believe no gift card should go unused and no gamer should pay full price. 
            GCHub bridges the gap between unused value and smart savings — creating a 
            community where everyone wins.
          </p>
        </div>

      </div>
    </div>
  )
}

export default About
