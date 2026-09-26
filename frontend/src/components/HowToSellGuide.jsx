import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown, Clock, ShieldCheck, Banknote } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'
import { buildStructuredData, structuredDataId, guideLinks, commonRelated } from '../data/howToSell'

const inr = (n) => `₹${n.toLocaleString('en-IN')}`

const HowToSellGuide = ({ guide }) => {
  const { brand, path, seo, intro, steps, needs, receive, example, safety, tips, faqs, updated, image } = guide
  const item = guide.item || `${brand} gift card`
  const related = [...(guide.related || []), ...guideLinks.filter((l) => l.to !== path), ...commonRelated]
  const heading = guide.heading || `How to sell a ${brand} gift card online`
  const commissionAmount = Math.round((example.value * example.commission) / 100)
  const payout = example.value - commissionAmount

  useSEO({
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    ogImage: 'https://redeemkart.in/redeemkart-logo.png',
    ogType: 'article',
    canonicalUrl: `https://redeemkart.in${path}`,
    structuredDataId: structuredDataId(guide),
    structuredData: buildStructuredData(guide),
  })

  return (
    <div className="bg-slate-50 min-h-screen font-['Inter',sans-serif] text-slate-600">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-4">
          <Link to="/" className="hover:text-slate-800">Home</Link>
          <span className="mx-1.5">/</span>
          <Link to="/sell-gift-card" className="hover:text-slate-800">Sell Gift Card</Link>
          <span className="mx-1.5">/</span>
          <span className="text-slate-700">{guide.heading || `How to sell ${brand} gift card`}</span>
        </nav>

        <header>
          <div className="flex items-center gap-2.5 mb-3">
            {image && <img src={image} alt={`${item} logo`} width="36" height="36" className="w-9 h-9 rounded-lg object-cover border border-slate-200 bg-white" />}
            <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Sell Guide</p>
          </div>
          <h1 className="font-['Poppins',sans-serif] text-2xl sm:text-4xl font-semibold text-slate-900 tracking-tight leading-tight">
            {heading}
          </h1>
          <p className="mt-3 text-[15px] sm:text-base leading-relaxed">{intro}</p>
          <p className="mt-2 text-xs text-slate-400">
            Last updated <time dateTime={updated.iso}>{updated.label}</time>
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
          <h2 className="font-['Poppins',sans-serif] text-lg sm:text-2xl font-semibold text-slate-900 mb-4">{guide.stepsHeading || `Steps to sell your ${brand} gift card`}</h2>
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
            <h2 className="font-['Poppins',sans-serif] text-base sm:text-lg font-semibold text-slate-900 mb-2">What you need to sell</h2>
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
          <h2 className="font-['Poppins',sans-serif] text-lg sm:text-2xl font-semibold text-slate-900 mb-1">How much money will you get for your {item}?</h2>
          <p className="text-sm mb-4">Here is an example of what you get when you sell your {item}.</p>
          <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 text-sm">
            <div className="flex justify-between p-4"><span>{item} value</span><span className="font-medium text-slate-900">{inr(example.value)}</span></div>
            <div className="flex justify-between p-4"><span>Commission ({example.commission}%)</span><span className="font-medium text-slate-900">-{inr(commissionAmount)}</span></div>
            <div className="flex justify-between p-4 bg-emerald-50/60 rounded-b-2xl"><span className="font-medium text-slate-900">You receive</span><span className="font-semibold text-emerald-700">{inr(payout)}</span></div>
          </div>
        </section>

        {safety && (
          <section className="mt-10 sm:mt-12">
            <h2 className="font-['Poppins',sans-serif] text-lg sm:text-2xl font-semibold text-slate-900 mb-1">{safety.heading}</h2>
            <p className="text-sm mb-4 leading-relaxed">{safety.text}</p>
            <ul className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 text-sm space-y-2">
              {safety.points.map((p) => (
                <li key={p} className="flex gap-2.5">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-10 sm:mt-12">
          <h2 className="font-['Poppins',sans-serif] text-lg sm:text-2xl font-semibold text-slate-900 mb-4">Tips to sell your {item} faster</h2>
          <ul className="bg-white border border-slate-200 rounded-2xl p-5 text-sm space-y-2 list-disc pl-9 marker:text-emerald-500">
            {tips.map((t) => <li key={t}>{t}</li>)}
          </ul>
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
            <h2 className="font-['Poppins',sans-serif] text-lg sm:text-xl font-semibold">Ready to sell your {item}?</h2>
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

export default HowToSellGuide
