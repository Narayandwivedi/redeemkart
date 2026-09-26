import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown, Clock, ShieldCheck, Banknote, BadgeCheck } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'
import { guideLinks, commonRelated } from '../data/howToSell'

const SITE = 'https://redeemkart.in'
const PATH = '/how-to-sell-gift-cards-in-india'
const UPDATED = { iso: '2026-09-26', label: '26 September 2026' }

const seo = {
  title: 'How to Sell Gift Cards in India (2026): Top 3 Sites Compared',
  description: 'Learn how to sell unused gift cards in India for cash. Compare RedeemKart, Crafin and Zingoy on payout speed, fees and safety, then sell in minutes.',
  keywords: 'how to sell gift cards in india, sell gift cards online india, best site to sell gift cards india, sell gift card for cash, gift card to bank account, redeemkart vs crafin, zingoy sell gift card, crafin sell gift card, RedeemKart',
}

const platforms = [
  {
    name: 'RedeemKart',
    tag: 'Our pick',
    model: 'Marketplace. You list the card, we verify it and sell it to a buyer.',
    payout: 'Bank account, usually 3-4 hours after the card sells',
    fees: '10% on Amazon, Flipkart and PhonePe, 20% on Myntra and MakeMyTrip, 25% on Google Play and Zomato, 30% on other brands. Free to list.',
    points: [
      'Sell Google Play, Amazon Pay, Amazon Shopping Voucher, Flipkart, PhonePe, Myntra, MakeMyTrip, Zomato, Steam, BigBasket and Reliance JioMart cards.',
      'Every card is verified before it is listed, so buyers trust the listings and cards sell faster.',
      'Your code is only shared with the buyer after purchase, and the money goes straight to your own bank account.',
      'The exact amount you will receive is shown before you publish, with no hidden charges.',
      'Most popular cards sell within 24 hours.',
    ],
    link: { to: '/sell-gift-card', label: 'Sell on RedeemKart' },
  },
  {
    name: 'Crafin',
    model: 'Direct buyer. Crafin buys the card from you at an offer price.',
    payout: 'Bank account or UPI after verification',
    fees: 'Offer price depends on the brand and is shown by Crafin',
    points: [
      'Accepts shopping, travel and entertainment cards such as Amazon, Flipkart, Myntra, Cleartrip and BookMyShow.',
      'You do not wait for a buyer. Crafin verifies the card and pays the offered price.',
      'Crafin says payments for popular brands like Amazon Pay, Flipkart and Myntra settle in about 30 minutes.',
    ],
  },
  {
    name: 'Zingoy',
    model: 'Marketplace. You set your own price and wait for a buyer.',
    payout: 'Zingoy wallet, then a withdrawal to your bank (2-3 working days)',
    fees: 'A processing fee is deducted when the card sells',
    points: [
      'You choose the selling price for your card.',
      'Listings can take up to 72 working hours to verify.',
      'After a sale there is a 10-day buyer protection period before the money is released to your wallet.',
      'The card must have more than 11 days left before expiry. Promo codes and scratch-card rewards are not accepted.',
    ],
  },
]

const steps = [
  { title: 'Check your gift card', text: 'Make sure the card is unused, not added to any account and not close to expiry. Keep the code and PIN ready.' },
  { title: 'Choose a trusted platform', text: 'Pick a platform that verifies cards and pays to your own bank account, not one that asks you to share the code in a chat.' },
  { title: 'List the card', text: 'On RedeemKart, open Sell Gift Card, choose the brand, enter the balance, code and PIN, then publish your listing.' },
  { title: 'Wait for verification and sale', text: 'The card is checked and put up for sale. Popular cards usually sell within 24 hours.' },
  { title: 'Get the money in your bank', text: 'Once the card sells, your payout is sent to your bank account, usually within 3-4 hours.' },
]

const safety = [
  'Never share a code or PIN with buyers on WhatsApp, Telegram or Instagram who promise to pay later.',
  'Do not post photos of your card online. Anyone who reads the code can use it.',
  'Ignore offers above the card value. They are almost always scams.',
  'Sell only on platforms that verify cards and pay to your own bank account.',
  'Do not redeem or add the card to your account if you plan to sell it. Redeemed balance cannot be sold.',
]

const faqs = [
  { q: 'How can I sell gift cards in India?', a: 'Use a gift card selling platform such as RedeemKart. Log in, open the Sell Gift Card page, choose the brand, enter the balance, code and PIN, and publish your listing. Once the card sells, the money is sent to your bank account.' },
  { q: 'Which is the best platform to sell gift cards in India?', a: 'It depends on what you need. RedeemKart verifies every card, pays to your bank account usually within 3-4 hours of the sale and charges only 10% on Amazon, Flipkart and PhonePe cards. Crafin buys cards directly at an offer price, and Zingoy lets you set your own price but holds payment during a 10-day buyer protection period.' },
  { q: 'How much money will I get for my gift card?', a: 'On RedeemKart you receive 90% of the card value for Amazon, Flipkart and PhonePe cards, 80% for Myntra and MakeMyTrip, 75% for Google Play and Zomato, and 70% for other brands. For example, a Rs. 1,000 Flipkart card pays Rs. 900. The exact amount is shown before you publish.' },
  { q: 'Which gift cards can I sell on RedeemKart?', a: 'Google Play, Amazon Pay Gift Card, Amazon Shopping Voucher, Flipkart, PhonePe, Myntra, MakeMyTrip, Zomato, Steam, BigBasket and Reliance JioMart gift cards.' },
  { q: 'Is it legal to sell gift cards in India?', a: 'Yes. You can sell an unused gift card that you own, as long as the brand\'s terms allow it to be transferred. Always sell through a platform that verifies cards.' },
  { q: 'Can I sell a gift card that I have already redeemed?', a: 'No. Once a card is added to an account, the balance is tied to that account and cannot be sold. Only unused cards can be sold.' },
  { q: 'Is it safe to sell gift cards online?', a: 'Yes, if you use a trusted platform. Avoid selling to strangers on social media, where most gift card scams happen.' },
]

const related = [...guideLinks.filter((l) => l.to !== PATH), ...commonRelated]

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to sell gift cards in India',
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
    name: 'How to Sell Gift Cards in India',
    description: 'Sell your unused gift card online and get paid to your bank account.',
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
      { '@type': 'ListItem', position: 3, name: 'How to Sell Gift Cards in India', item: `${SITE}${PATH}` },
    ],
  },
]

const h2 = "font-['Poppins',sans-serif] text-lg sm:text-2xl font-semibold text-slate-900"

const HowToSellGiftCardsInIndia = () => {
  useSEO({
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    ogImage: `${SITE}/redeemkart-logo.png`,
    ogType: 'article',
    canonicalUrl: `${SITE}${PATH}`,
    structuredDataId: 'how-to-sell-gift-cards-india-structured-data',
    structuredData,
  })

  return (
    <div className="bg-slate-50 min-h-screen font-['Inter',sans-serif] text-slate-600">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-4">
          <Link to="/" className="hover:text-slate-800">Home</Link>
          <span className="mx-1.5">/</span>
          <Link to="/sell-gift-card" className="hover:text-slate-800">Sell Gift Card</Link>
          <span className="mx-1.5">/</span>
          <span className="text-slate-700">How to sell gift cards in India</span>
        </nav>

        <header>
          <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-2">Sell Guide</p>
          <h1 className="font-['Poppins',sans-serif] text-2xl sm:text-4xl font-semibold text-slate-900 tracking-tight leading-tight">
            How to sell gift cards in India
          </h1>
          <p className="mt-3 text-[15px] sm:text-base leading-relaxed">
            Got a gift card you will never use? Gift card balance usually cannot be withdrawn to a bank account, but you can
            sell the unused card online for cash. This guide compares three popular platforms to sell gift cards in India,
            RedeemKart, Crafin and Zingoy, and shows you how to sell your card safely.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Last updated <time dateTime={UPDATED.iso}>{UPDATED.label}</time>
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { icon: Clock, label: 'Paid in 3-4 hours' },
              { icon: ShieldCheck, label: 'Cards verified' },
              { icon: Banknote, label: 'Free to list' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center justify-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2 py-2.5 text-[11px] sm:text-sm font-medium text-slate-700">
                <Icon className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </header>

        <section className="mt-10 sm:mt-12">
          <h2 className={`${h2} mb-4`}>Best platforms to sell gift cards in India</h2>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm text-left">
              <thead className="bg-slate-50 text-slate-900">
                <tr>
                  <th className="p-4 font-semibold">Platform</th>
                  <th className="p-4 font-semibold">How it works</th>
                  <th className="p-4 font-semibold">Payout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {platforms.map((p) => (
                  <tr key={p.name} className={p.tag ? 'bg-emerald-50/60' : ''}>
                    <td className="p-4 font-medium text-slate-900 whitespace-nowrap">{p.name}</td>
                    <td className="p-4">{p.model}</td>
                    <td className="p-4">{p.payout}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {platforms.map((p, i) => (
          <section key={p.name} className="mt-10 sm:mt-12">
            <div className="flex items-center gap-2 mb-3">
              <h2 className={h2}>{i + 1}. {p.name}</h2>
              {p.tag && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  {p.tag}
                </span>
              )}
            </div>
            <div className={`bg-white border rounded-2xl p-5 ${p.tag ? 'border-emerald-200' : 'border-slate-200'}`}>
              <dl className="grid sm:grid-cols-3 gap-3 text-sm mb-4">
                <div><dt className="text-xs text-slate-400">How it works</dt><dd className="text-slate-900 mt-0.5">{p.model}</dd></div>
                <div><dt className="text-xs text-slate-400">Payout</dt><dd className="text-slate-900 mt-0.5">{p.payout}</dd></div>
                <div><dt className="text-xs text-slate-400">Fees</dt><dd className="text-slate-900 mt-0.5">{p.fees}</dd></div>
              </dl>
              <ul className="text-sm space-y-1.5 list-disc pl-5 marker:text-emerald-500">
                {p.points.map((pt) => <li key={pt}>{pt}</li>)}
              </ul>
              {p.link && (
                <Link to={p.link.to} className="group inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                  {p.link.label}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
            </div>
          </section>
        ))}

        <p className="mt-4 text-xs text-slate-400">
          Details for Crafin and Zingoy are taken from their websites as of {UPDATED.label} and may change. Check each platform for its latest terms.
        </p>

        <section className="mt-10 sm:mt-12">
          <h2 className={`${h2} mb-4`}>How to sell a gift card online in India (step by step)</h2>
          <ol className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-3 sm:gap-4 p-4 sm:p-5">
                <span className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-[15px] sm:text-base font-semibold text-slate-900">{s.title}</h3>
                  <p className="text-sm mt-0.5 leading-relaxed">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10 sm:mt-12">
          <h2 className={`${h2} mb-1`}>How to sell gift cards safely</h2>
          <p className="text-sm mb-4 leading-relaxed">Most gift card scams happen on social media and chat apps, where the buyer gets the code first and the seller never gets paid.</p>
          <ul className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 text-sm space-y-2">
            {safety.map((s) => (
              <li key={s} className="flex gap-2.5">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 sm:mt-12">
          <h2 className={`${h2} mb-4`}>Frequently asked questions about selling gift cards</h2>
          <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
            {faqs.map((f) => (
              <details key={f.q} className="group p-4 sm:p-5">
                <summary className="flex items-center justify-between gap-3 cursor-pointer list-none text-[15px] font-medium text-slate-900">
                  {f.q}
                  <ChevronDown className="w-4 h-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
                </summary>
                <p className="text-sm mt-2 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-10 sm:mt-12 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-['Poppins',sans-serif] text-lg sm:text-xl font-semibold">Ready to sell your gift card?</h2>
            <p className="text-sm text-emerald-50/85 mt-1">It takes a few minutes to list.</p>
          </div>
          <Link
            to="/sell-gift-card"
            className="group inline-flex items-center justify-center gap-2 shrink-0 bg-amber-400 hover:bg-amber-300 text-slate-900 text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Sell Gift Card
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

export default HowToSellGiftCardsInIndia
