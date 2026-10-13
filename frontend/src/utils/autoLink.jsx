import React from 'react'
import { Link } from 'react-router-dom'

// Phrases in guide copy that link to the page they name. Longer phrases first so they win over shorter ones.
const LINKS = [
  { phrase: 'Log in to RedeemKart', to: '/login' },
  { phrase: 'Sell Gift Card page', to: '/sell-gift-card' },
  { phrase: 'Payout Details', to: '/payout-details' },
  { phrase: 'My Sales', to: '/my-sales' },
  { phrase: 'Create one', to: '/login?mode=signup' },
  { phrase: 'Sign in', to: '/login' },
]

const pattern = new RegExp(`(${LINKS.map((l) => l.phrase).join('|')})`, 'g')
const targetOf = (phrase) => LINKS.find((l) => l.phrase === phrase).to

// Turns known phrases in `text` into links. Each target is linked once per `used` set,
// so pass the same set for every text block in one section to avoid repeating links.
export const autoLink = (text, used = new Set()) =>
  text.split(pattern).map((part, i) => {
    if (i % 2 === 0) return part
    const to = targetOf(part)
    const key = to.split('?')[0]
    if (used.has(key)) return part
    used.add(key)
    return (
      <Link key={i} to={to} className="text-emerald-700 hover:text-emerald-800 font-medium underline decoration-emerald-200 underline-offset-2">
        {part}
      </Link>
    )
  })
