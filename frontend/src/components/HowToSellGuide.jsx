import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown, Clock, ShieldCheck, Banknote } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'

const HowToSellGuide = ({ brand, path, seo, intro, steps, needs, receive, faqs }) => {
  const url = `https://redeemkart.in${path}`

  useSEO({
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    ogImage: 'https://redeemkart.in/redeemkart-logo.png',
    canonicalUrl: url,
    structuredDataId: `how-to-sell-${brand.toLowerCase()}-structured-data`,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: `How to Sell a ${brand} Gift Card on RedeemKart`,
        description: `Sell your unused ${brand} gift card on RedeemKart and get paid to your bank account.`,
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
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://redeemkart.in/' },
          { '@type': 'ListItem', position: 2, name: 'Sell Gift Card', item: 'https://redeemkart.in/sell-gift-card' },
          { '@type': 'ListItem', position: 3, name: `How to Sell ${brand} Gift Card`, item: url },
        ],
      },
    ],
  })

  return (
    <div className="bg-slate-50 min-h-screen font-['Inter',sans-serif] text-slate-600">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <header>
          <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-2">Sell Guide</p>
          <h1 className="font-['Poppins',sans-serif] text-2xl sm:text-4xl font-semibold text-slate-900 tracking-tight leading-tight">
            How to sell a {brand} gift card
          </h1>
          <p className="mt-3 text-[15px] sm:text-base leading-relaxed">{intro}</p>

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
          <h2 className="font-['Poppins',sans-serif] text-lg sm:text-2xl font-semibold text-slate-900 mb-4">Steps to sell your card</h2>
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

        <section className="mt-10 sm:mt-12 grid sm:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="font-['Poppins',sans-serif] text-base sm:text-lg font-semibold text-slate-900 mb-2">Before you start</h2>
            <ul className="text-sm space-y-1.5 list-disc pl-5 marker:text-emerald-500">
              {needs.map((n) => <li key={n}>{n}</li>)}
            </ul>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="font-['Poppins',sans-serif] text-base sm:text-lg font-semibold text-slate-900 mb-2">What you receive</h2>
            <ul className="text-sm space-y-1.5 list-disc pl-5 marker:text-emerald-500">
              {receive.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </div>
        </section>

        <section className="mt-10 sm:mt-12">
          <h2 className="font-['Poppins',sans-serif] text-lg sm:text-2xl font-semibold text-slate-900 mb-4">Frequently asked questions</h2>
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
            <h2 className="font-['Poppins',sans-serif] text-lg sm:text-xl font-semibold">Ready to sell your {brand} gift card?</h2>
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
      </div>
    </div>
  )
}

export default HowToSellGuide
