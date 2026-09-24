import React from 'react'
import { Check, AlertCircle, DollarSign, Clock, Lock, Users, ChevronDown } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'

const HowToSellFlipkartGiftCard = () => {
  const [expandedFAQ, setExpandedFAQ] = React.useState(null)

  useSEO({
    title: 'How to Sell Flipkart Gift Card Online | Best Price Guarantee | RedeemKart',
    description: 'Learn how to sell your unused Flipkart gift card on RedeemKart. Get instant cash at the best prices in India. Simple 3-step process, instant payouts, zero fees. Complete guide with step-by-step instructions.',
    keywords: 'how to sell flipkart gift card, sell flipkart voucher, sell flipkart gift cards online, flipkart gift card buyer, instant cash for gift card, best price flipkart gift card, RedeemKart flipkart',
    ogImage: 'https://redeemkart.in/redeemkart-logo.png',
    canonicalUrl: 'https://redeemkart.in/how-to-sell-flipkart-gift-card',
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "HowToGuide",
        "name": "How to Sell Flipkart Gift Card on RedeemKart",
        "description": "Complete guide on how to sell your Flipkart gift card online and get instant cash on RedeemKart",
        "url": "https://redeemkart.in/how-to-sell-flipkart-gift-card",
        "image": "https://redeemkart.in/redeemkart-logo.png",
        "author": {
          "@type": "Organization",
          "name": "RedeemKart"
        },
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Create Account",
            "description": "Sign up on RedeemKart with your email and mobile number"
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "List Your Gift Card",
            "description": "Enter your Flipkart gift card details and set your asking price"
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Get Instant Payment",
            "description": "Receive instant cash directly to your bank account"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How much can I get for my Flipkart gift card?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "RedeemKart offers the best prices for Flipkart gift cards. The amount depends on the card value and current demand. Typically, you can get 85-95% of the face value."
            }
          },
          {
            "@type": "Question",
            "name": "Is it safe to sell my gift card on RedeemKart?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, RedeemKart is 100% secure. We verify all gift cards before payment and use encrypted connections to protect your information."
            }
          },
          {
            "@type": "Question",
            "name": "How long does it take to get paid?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Payments are processed instantly. Once your gift card is verified, the money is transferred directly to your bank account within minutes."
            }
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://redeemkart.in/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Sell Gift Cards",
            "item": "https://redeemkart.in/sell-gift-card"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "How to Sell Flipkart Gift Card",
            "item": "https://redeemkart.in/how-to-sell-flipkart-gift-card"
          }
        ]
      }
    ]
  })

  const steps = [
    {
      number: 1,
      title: 'Sign Up & Verify',
      description: 'Create a free RedeemKart account with your email and phone number. Complete quick KYC verification for faster payouts.',
      icon: Users,
      details: ['Enter your details', 'Get OTP verification', 'Complete KYC in 2 minutes']
    },
    {
      number: 2,
      title: 'List Your Gift Card',
      description: 'Upload your Flipkart gift card details - enter the PIN, amount, and your asking price. Set the best price to sell faster.',
      icon: DollarSign,
      details: ['Enter gift card PIN', 'Set your price', 'Choose payment method']
    },
    {
      number: 3,
      title: 'Verification',
      description: 'Our team verifies your gift card authenticity within minutes. No delays, no hassles, no hidden fees.',
      icon: Lock,
      details: ['Quick verification', 'Real-time updates', 'Transparent process']
    },
    {
      number: 4,
      title: 'Get Paid Instantly',
      description: 'Once verified, get instant cash directly to your linked bank account. Track your payment in real-time on your dashboard.',
      icon: Clock,
      details: ['Instant bank transfer', 'Zero transaction fees', 'Track payments online']
    }
  ]

  const benefits = [
    {
      title: 'Best Prices for Flipkart Gift Cards',
      description: 'RedeemKart guarantees the best rates compared to other platforms. Sell Flipkart vouchers at 85-95% of face value.'
    },
    {
      title: 'Instant Cash Payouts',
      description: 'Get money in your bank account within minutes of verification. No waiting, no delays, completely hassle-free.'
    },
    {
      title: '100% Secure & Safe',
      description: 'Your transactions are encrypted and protected. We verify all gift cards before payment. Trade with complete confidence.'
    },
    {
      title: 'Zero Hidden Fees',
      description: 'What you see is what you get. No deductions, no charges, no surprises. Transparent pricing always.'
    },
    {
      title: 'Easy 4-Step Process',
      description: 'Simple and straightforward process to sell your Flipkart gift card. Complete in minutes, not hours.'
    },
    {
      title: '24/7 Customer Support',
      description: 'Our support team is always available to help you with any questions or issues regarding your gift card sale.'
    }
  ]

  const faqs = [
    {
      question: 'How much will I get for my Flipkart gift card?',
      answer: 'The amount you receive depends on the gift card value and current market demand. RedeemKart typically offers 85-95% of the face value for Flipkart gift cards. The exact price is determined based on real-time market rates and is displayed before you list your card.'
    },
    {
      question: 'Is it safe to sell my gift card on RedeemKart?',
      answer: 'Absolutely! RedeemKart is 100% secure and trusted by thousands of users. We use encrypted connections, verify all gift cards before payment, and follow strict security protocols. Your personal and financial information is completely protected.'
    },
    {
      question: 'How long does it take to receive payment?',
      answer: 'Payments are processed instantly! Once your Flipkart gift card is verified (usually within 5-15 minutes), the money is transferred directly to your bank account. You can track the payment status in real-time on your RedeemKart dashboard.'
    },
    {
      question: 'Do I need to complete KYC to sell a gift card?',
      answer: 'Yes, KYC is required for all transactions on RedeemKart. This is to comply with RBI guidelines and ensure secure transactions. The good news is that KYC verification takes just 2-3 minutes and is a one-time process.'
    },
    {
      question: 'Can I sell Flipkart gift cards from any state in India?',
      answer: 'Yes, RedeemKart operates across India and accepts Flipkart gift cards from users in all states. Whether you are in Delhi, Mumbai, Bangalore, or any other city, you can sell your gift card on our platform.'
    },
    {
      question: 'What if my gift card is invalid or has already been used?',
      answer: 'RedeemKart verifies every gift card before processing payment. If your card is invalid or already used, we will notify you immediately and the transaction will not be completed. Your card details remain secure.'
    },
    {
      question: 'Can I sell a partially used Flipkart gift card?',
      answer: 'Yes! You can sell a Flipkart gift card with any remaining balance. Just enter the current balance when listing your card, and we will pay based on that amount.'
    },
    {
      question: 'How can I get the best price for my Flipkart gift card?',
      answer: 'To get the best price: (1) Sell during high-demand periods, (2) Keep your gift card active and not expired, (3) List at competitive prices, (4) Complete KYC for faster verification, (5) Choose realistic prices to sell faster.'
    }
  ]

  const faqToggle = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/40">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight">
            How to Sell <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Flipkart Gift Card</span> Online
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-4">
            Turn your unused Flipkart gift card into instant cash with RedeemKart — India's most trusted gift card marketplace
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base">
            <div className="flex items-center gap-2 text-emerald-600 font-semibold">
              <Check className="w-5 h-5" /> Instant Payouts
            </div>
            <div className="flex items-center gap-2 text-emerald-600 font-semibold">
              <Check className="w-5 h-5" /> Best Prices
            </div>
            <div className="flex items-center gap-2 text-emerald-600 font-semibold">
              <Check className="w-5 h-5" /> 100% Secure
            </div>
          </div>
        </div>
      </div>

      {/* 4-Step Process */}
      <div className="bg-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-12">
            Simple 4-Step Process to Sell Your Flipkart Gift Card
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="relative">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 h-full hover:shadow-lg transition-shadow">
                    <div className="absolute -top-4 left-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                    <div className="mb-4 mt-2">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                    <p className="text-slate-600 mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                          <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-blue-300 text-2xl font-light">→</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Why Choose RedeemKart */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-12">
          Why Choose RedeemKart to Sell Flipkart Gift Cards?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 text-blue-600">
                    <Check className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-slate-600 text-sm">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Sell Flipkart Gift Cards Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Why Should You Sell Your Flipkart Gift Card?
          </h2>

          <div className="bg-white rounded-xl p-8 border border-slate-200 space-y-4">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Convert Unused Cards to Cash</h3>
                <p className="text-slate-600">Got a Flipkart gift card you won't use? Instead of it gathering dust, sell it on RedeemKart and get instant cash in your bank account.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Get Best Market Rates</h3>
                <p className="text-slate-600">RedeemKart offers the best prices for Flipkart gift cards in India. Sell at 85-95% of face value and maximize your returns.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Trusted by Thousands</h3>
                <p className="text-slate-600">Join 10,000+ active traders on RedeemKart. We are India's most popular gift card marketplace with 100% secure transactions.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No Hidden Fees or Charges</h3>
                <p className="text-slate-600">What you see is what you get. No deductions, no hidden charges, completely transparent pricing and instant payouts.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">
          Pro Tips to Sell Your Flipkart Gift Card Faster
        </h2>

        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
            <h3 className="font-bold text-slate-900 mb-2">✓ Price Competitively</h3>
            <p className="text-slate-600">Check current market rates and price your gift card competitively. Lower prices sell faster but maximize your returns.</p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
            <h3 className="font-bold text-slate-900 mb-2">✓ Complete KYC Early</h3>
            <p className="text-slate-600">Complete KYC verification before listing to enable faster payment processing. It only takes 2-3 minutes!</p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
            <h3 className="font-bold text-slate-900 mb-2">✓ Ensure Card Validity</h3>
            <p className="text-slate-600">Make sure your gift card is not expired and has not been used. Verify the PIN and amount before listing.</p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
            <h3 className="font-bold text-slate-900 mb-2">✓ Sell During Peak Times</h3>
            <p className="text-slate-600">Sell during weekends and festival seasons when demand is highest. You might get better rates!</p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
            <h3 className="font-bold text-slate-900 mb-2">✓ Update Bank Details</h3>
            <p className="text-slate-600">Ensure your bank account details are correct for instant fund transfer without any delays.</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => faqToggle(index)}
                  className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
                >
                  <h3 className="font-bold text-slate-900 text-left">{faq.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-600 flex-shrink-0 transition-transform ${expandedFAQ === index ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-6 bg-slate-50 border-t border-slate-200">
                    <p className="text-slate-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Sell Your Flipkart Gift Card?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of sellers earning instant cash on RedeemKart. Get started today!
          </p>
          <a
            href="/sell-gift-card"
            className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Start Selling Now
          </a>
        </div>
      </div>
    </div>
  )
}

export default HowToSellFlipkartGiftCard
