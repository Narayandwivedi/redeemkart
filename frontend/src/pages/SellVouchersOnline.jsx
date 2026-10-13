import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown, Clock, ShieldCheck, Banknote, XCircle } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'
import { autoLink } from '../utils/autoLink'
import { guideLinks, commonRelated } from '../data/howToSell'
import { brands, brandLogos, noPinBrands, pinRequiredBrands, getCommissionRate, getPayout } from '../data/sellBrands'

const SITE = 'https://redeemkart.in'
const PATH = '/sell-vouchers-online-for-cash'
const UPDATED = { iso: '2026-10-13', label: '13 October 2026' }

const seo = {
  title: 'Sell Vouchers Online for Cash in India | RedeemKart',
  description: 'Sell unused gift vouchers online for cash in India. Amazon, Flipkart, Myntra, Google Play, PhonePe and more. Get up to 90% of the value paid to your bank account.',
  keywords: 'sell vouchers online for cash in india, sell vouchers online, sell voucher for cash, sell gift vouchers online india, voucher to cash, convert voucher to cash, sell unused vouchers, gift voucher buyer india, RedeemKart',
}

// Brand guides, shown next to each voucher in the payout table
const brandGuides = {
  'Google Play': '/how-to-convert-redeem-code-into-money',
  Flipkart: '/how-to-sell-flipkart-gift-card',
  'Amazon Pay Gift Card': '/how-to-sell-amazon-pay-gift-card',
  'Amazon Shopping Voucher': '/how-to-sell-amazon-shopping-voucher',
  Myntra: '/how-to-sell-myntra-gift-card',
  MakeMyTrip: '/how-to-sell-makemytrip-gift-card',
  PhonePe: '/how-to-sell-phonepe-gift-card',
  Zomato: '/how-to-sell-zomato-gift-card',
  Decathlon: '/how-to-sell-decathlon-gift-card',
  BigBasket: '/how-to-sell-bigbasket-gift-card',
}

const details = (brand) => {
  if (brand === 'Flipkart') return 'Card number + 6-digit PIN'
  if (noPinBrands.includes(brand)) return 'Code only'
  if (pinRequiredBrands.includes(brand)) return 'Code + PIN'
  return 'Code, plus PIN if any'
}

const rows = brands
  .map((b) => ({ brand: b, rate: getCommissionRate(b), payout: getPayout(b, 1000) }))
  .sort((a, b) => a.rate - b.rate)

const brandList = `${brands.slice(0, -1).join(', ')} and ${brands[brands.length - 1]}`

const steps = [
  { title: 'Keep the voucher unused', text: 'Do not add the voucher to your account or use it on an order. Once added, the balance is locked to that account and cannot be sold.' },
  { title: 'Log in to RedeemKart', text: 'Sign in with your account. New here? Create one in under a minute.' },
  { title: 'Choose the voucher brand', text: 'Open the Sell Gift Card page, pick the brand and enter the balance on your voucher. Your payout is shown right away.' },
  { title: 'Enter the code and PIN', text: 'Add the voucher code and PIN exactly as they appear in your email, SMS or card, then publish your listing.' },
  { title: 'We verify and list it', text: 'Our team checks the voucher and puts it up for sale. Popular vouchers usually sell within 24 hours.' },
  { title: 'Get cash in your bank', text: 'Once the voucher sells, your payout is sent to your bank account, usually within 3-4 hours.' },
]

const notAccepted = [
  'Vouchers already added to an account or partly used',
  'Expired vouchers',
  'Discount coupons and promo codes',
  'Reward points, wallet balance and cashback',
  'Brands not listed in the table above',
]

const safety = [
  'Never share a voucher code with buyers on WhatsApp, Telegram or Instagram who promise to pay later.',
  'Do not post a photo or screenshot of your voucher. Anyone who reads the code can use it.',
  'Ignore offers above the voucher value. They are almost always scams.',
  'Sell only where the voucher is verified and the money goes to your own bank account.',
]

const faqs = [
  { q: 'How can I sell vouchers online for cash in India?', a: 'Log in to RedeemKart, open the Sell Gift Card page, choose the voucher brand, enter the balance, the code and the PIN, then publish your listing. Once the voucher sells, the money is sent to your bank account, usually within 3-4 hours.' },
  { q: 'Which vouchers can I sell on RedeemKart?', a: `You can sell ${brandList} vouchers and gift cards.` },
  { q: 'How much cash will I get for my voucher?', a: 'It depends on the brand. You receive 90% of the value for Amazon, Flipkart and PhonePe vouchers, 80% for Myntra and MakeMyTrip, 75% for Google Play and Zomato, and 70% for other brands. For example, a Rs. 1,000 Flipkart voucher pays Rs. 900. The exact amount is shown before you publish.' },
  { q: 'Can I transfer voucher balance to my bank account?', a: 'Brands like Amazon, Flipkart and Myntra do not let you withdraw voucher balance to a bank account. Selling the unused voucher is the way to turn it into cash.' },
  { q: 'Is it free to sell a voucher?', a: 'Yes. Listing is free. The commission is only deducted when your voucher sells.' },
  { q: 'How long does it take to get paid?', a: 'Popular vouchers usually sell within 24 hours, and the payout is released to your bank account about 3-4 hours after the sale.' },
  { q: 'Is it legal to sell vouchers in India?', a: 'Yes. You can sell an unused voucher that you own, as long as the brand\'s terms allow it to be transferred.' },
  { q: 'What happens if my voucher is invalid?', a: 'It is rejected during verification and no payment is made. Check the code, PIN and expiry date before you publish.' },
]

const related = [...guideLinks.filter((l) => l.to !== PATH), ...commonRelated]

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Sell vouchers online for cash in India',
    description: seo.description,
    mainEntityOfPage: `${SITE}${PATH}`,
    image: `${SITE}/redeemkart-logo.png`,
    datePublished: UPDATED.iso,
    dateModified: UPDATED.iso,
    inLanguage: 'en-IN',
    author: { '@type': 'Organization', name: 'RedeemKart', url: SITE },
    publisher: {
      '@type': 'Organization',
      name: 'RedeemKart',
      url: SITE,
      logo: { '@type': 'ImageObject', url: `${SITE}/redeemkart-logo.png` },
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Sell Vouchers Online for Cash on RedeemKart',
    description: 'Sell your unused voucher online and get paid to your bank account.',
    totalTime: 'PT5M',
    step: steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.text })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Sell Gift Card', item: `${SITE}/sell-gift-card` },
      { '@type': 'ListItem', position: 3, name: 'Sell Vouchers Online for Cash', item: `${SITE}${PATH}` },
    ],
  },
]

const h2 = "font-['Poppins',sans-serif] text-lg sm:text-2xl font-semibold text-slate-900"
const rupees = (n) => `₹${n.toLocaleString('en-IN')}`

const SellVouchersOnline = () => {
  useSEO({
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    ogImage: `${SITE}/redeemkart-logo.png`,
    ogType: 'article',
    canonicalUrl: `${SITE}${PATH}`,
    structuredDataId: 'sell-vouchers-online-for-cash-structured-data',
    structuredData,
  })

  const stepLinks = new Set()
  const faqLinks = new Set()

  return (
    <div className="bg-slate-50 min-h-screen font-['Inter',sans-serif] text-slate-600">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-4">
          <Link to="/" className="hover:text-slate-800">Home</Link>
          <span className="mx-1.5">/</span>
          <Link to="/sell-gift-card" className="hover:text-slate-800">Sell Gift Card</Link>
          <span className="mx-1.5">/</span>
          <span className="text-slate-700">Sell vouchers online for cash</span>
        </nav>

        <header>
          <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-2">Sell Guide</p>
          <h1 className="font-['Poppins',sans-serif] text-2xl sm:text-4xl font-semibold text-slate-900 tracking-tight leading-tight">
            Sell vouchers online for cash in India
          </h1>
          <p className="mt-3 text-[15px] sm:text-base leading-relaxed">
            Got an Amazon, Flipkart, Myntra or Google Play voucher you will never use? Voucher balance usually cannot be
            withdrawn to a bank account, but you can sell the unused voucher online on RedeemKart. List the code, we verify
            it and sell it to a buyer, and the cash goes straight to your bank account.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Last updated <time dateTime={UPDATED.iso}>{UPDATED.label}</time>
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { icon: Banknote, label: 'Up to 90% cash' },
              { icon: Clock, label: 'Paid in 3-4 hours' },
              { icon: ShieldCheck, label: 'Free to list' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center justify-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2 py-2.5 text-[11px] sm:text-sm font-medium text-slate-700">
                <Icon className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{label}</span>
              </div>
            ))}
          </div>

          <Link
            to="/sell-gift-card"
            className="group mt-5 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Sell your voucher now
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </header>

        <section className="mt-10 sm:mt-12">
          <h2 className={`${h2} mb-1`}>How much cash you get for each voucher</h2>
          <p className="text-sm mb-4 leading-relaxed">Payout for a {rupees(1000)} voucher. Commission is only deducted when your voucher sells.</p>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm text-left">
              <thead className="bg-slate-50 text-slate-900">
                <tr>
                  <th className="p-4 font-semibold">Voucher</th>
                  <th className="p-4 font-semibold">You get</th>
                  <th className="p-4 font-semibold">{rupees(1000)} pays</th>
                  <th className="p-4 font-semibold">Details needed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.brand}>
                    <td className="p-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2.5">
                        {brandLogos[r.brand]
                          ? <img src={brandLogos[r.brand]} alt="" className="w-7 h-7 rounded object-contain shrink-0" loading="lazy" />
                          : <span className="w-7 h-7 rounded bg-slate-100 shrink-0" />}
                        {brandGuides[r.brand]
                          ? <Link to={brandGuides[r.brand]} className="hover:text-emerald-700">{r.brand}</Link>
                          : r.brand}
                      </div>
                    </td>
                    <td className="p-4">{100 - r.rate}%</td>
                    <td className="p-4 font-semibold text-emerald-700">{rupees(r.payout)}</td>
                    <td className="p-4">{details(r.brand)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10 sm:mt-12">
          <h2 className={`${h2} mb-4`}>How to sell a voucher online for cash</h2>
          <ol className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-3 sm:gap-4 p-4 sm:p-5">
                <span className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-[15px] sm:text-base font-semibold text-slate-900">{s.title}</h3>
                  <p className="text-sm mt-0.5 leading-relaxed">{autoLink(s.text, stepLinks)}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10 sm:mt-12">
          <h2 className={`${h2} mb-4`}>Vouchers you cannot sell</h2>
          <ul className="bg-white border border-slate-200 rounded-2xl p-5 text-sm space-y-2">
            {notAccepted.map((s) => (
              <li key={s} className="flex gap-2.5">
                <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 sm:mt-12">
          <h2 className={`${h2} mb-1`}>Sell your voucher safely</h2>
          <p className="text-sm mb-4 leading-relaxed">Most voucher scams happen on social media and chat apps, where the buyer gets the code first and the seller never gets paid.</p>
          <ul className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 text-sm space-y-2">
            {safety.map((s) => (
              <li key={s} className="flex gap-2.5">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm mt-4">
            Comparing other sites?{' '}
            <Link to="/how-to-sell-gift-cards-in-india" className="text-emerald-700 hover:text-emerald-800 font-medium">See RedeemKart vs Crafin vs Zingoy &rarr;</Link>
          </p>
        </section>

        <section className="mt-10 sm:mt-12">
          <h2 className={`${h2} mb-4`}>Frequently asked questions</h2>
          <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
            {faqs.map((f) => (
              <details key={f.q} className="group p-4 sm:p-5">
                <summary className="flex items-center justify-between gap-3 cursor-pointer list-none text-[15px] font-medium text-slate-900">
                  {f.q}
                  <ChevronDown className="w-4 h-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
                </summary>
                <p className="text-sm mt-2 leading-relaxed">{autoLink(f.a, faqLinks)}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-10 sm:mt-12 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-['Poppins',sans-serif] text-lg sm:text-xl font-semibold">Turn your voucher into cash</h2>
            <p className="text-sm text-emerald-50/85 mt-1">It takes a few minutes to list.</p>
          </div>
          <Link
            to="/sell-gift-card"
            className="group inline-flex items-center justify-center gap-2 shrink-0 bg-amber-400 hover:bg-amber-300 text-slate-900 text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Sell Voucher
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </section>

        <section className="mt-10 sm:mt-12">
          <h2 className="font-['Poppins',sans-serif] text-base sm:text-lg font-semibold text-slate-900 mb-3">Related pages</h2>
          <ul className="space-y-1.5 text-sm">
            {related.map((r) => (
              <li key={r.to}>
                <Link to={r.to} className="text-emerald-700 hover:text-emerald-800 font-medium">{r.label} &rarr;</Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

export default SellVouchersOnline
