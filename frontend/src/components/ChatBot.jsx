import React, { useState, useRef, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, X, Send, Bot, Sparkles, RotateCcw, Gift, Lock } from 'lucide-react'
import { AppContext } from '../context/AppContext'
import { useCart } from '../context/CartContext'
import { gamesList } from '../data/games'
import { brands, brandLogos, noPinBrands, pinRequiredBrands, getCommissionRate, getPayout } from '../data/sellBrands'

// Shortcuts shown above the input. `action` is handled by runAction.
const QUICK_ACTIONS = [
  { label: 'Sell a gift card', action: 'sell' },
  { label: 'My sales status', action: 'sales' },
  { label: 'How much will I get?', action: 'rates' },
  { label: 'Buy gift cards', action: 'nav:/gift-cards' },
  { label: 'My orders', action: 'nav:/my-orders' },
  { label: 'Payout details', action: 'nav:/payout-details' },
  { label: 'My code is not working', action: 'text:My code is not working' },
  { label: 'I want a refund', action: 'text:I want a refund' },
]

const SALE_STATUS = {
  pending: { label: 'Under review', cls: 'bg-amber-50 text-amber-700' },
  active: { label: 'Listed for sale', cls: 'bg-emerald-50 text-emerald-700' },
  sold: { label: 'Sold, payout in progress', cls: 'bg-blue-50 text-blue-700' },
  sold_out: { label: 'Sold, payout in progress', cls: 'bg-blue-50 text-blue-700' },
  paid: { label: 'Paid', cls: 'bg-green-50 text-green-700' },
  rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-700' },
  used: { label: 'Already used', cls: 'bg-purple-50 text-purple-700' },
  expired: { label: 'Expired', cls: 'bg-slate-100 text-slate-600' },
}

const GAME_PRODUCT_IDS = ['gta-5', 'rdr2', 'cyberpunk', 'the-last-of-us-2', 'resident-evil-4', 'san-andreas', 'the-witcher-3', 'god-of-war', 'cod-modern-warfare-2', 'mafia-3', 'forza-horizon-5', 'bundle-all-11']

const isGameItem = (item) =>
  GAME_PRODUCT_IDS.includes(item.productId) ||
  item.productBrand?.toLowerCase() === 'game' ||
  item.productName?.toLowerCase().includes('game')

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const RATES_TEXT = `Listing is free. Commission is deducted only when your card sells:

• Amazon Pay, Amazon Shopping Voucher, Flipkart, PhonePe: **10%** (you get 90%)
• Myntra, MakeMyTrip: **20%** (you get 80%)
• Google Play, Zomato: **25%** (you get 75%)
• JioMart, Steam, BigBasket: **30%** (you get 70%)

Example: a ₹1,000 Flipkart card pays you **₹900**, usually within 3-4 hours after it sells.`

// Renders **bold** from bot replies; everything else stays plain text
const renderText = (text) =>
  String(text).split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part))

const optionBtnCls =
  'text-xs font-medium px-3 py-2 bg-slate-50 hover:bg-violet-50 hover:border-violet-300 border border-slate-200 rounded-xl transition-all cursor-pointer text-slate-700 hover:text-violet-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-50 disabled:hover:border-slate-200 disabled:hover:text-slate-700'

const ChatBot = () => {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user, isAuthenticated, BACKEND_URL } = useContext(AppContext)
  const [isOpen, setIsOpen] = useState(false)

  const welcome = () => ({
    role: 'assistant',
    content: `Hi ${user?.fullName?.split(' ')[0] || 'there'} 👋 I'm the RedeemKart assistant. I can help you sell a gift card, check your sales, or answer any question.`,
    id: 'welcome'
  })

  const [messages, setMessages] = useState(() => [welcome()])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)

  // Refund flow: null, 'select_item', 'ask_reason'
  const [refundStep, setRefundStep] = useState(null)
  const [refundItem, setRefundItem] = useState(null)

  // Sell flow: null or { step: 'brand' | 'balance' | 'code' | 'pin' | 'confirm', brand, balance, code, pin }
  const [sell, setSell] = useState(null)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  // Groups the AI messages of one chat on the server; a reset starts a new one
  const conversationIdRef = useRef(uid())

  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false)
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  /* ---------- Saving the conversation ---------- */

  // The server saves what goes through the AI. Everything the widget answers itself
  // (sell, refund, sales, games) is queued here and sent in order, so the saved
  // conversation has no gaps.
  const logQueue = useRef([])
  const logTimer = useRef(null)

  const flushLog = () => {
    clearTimeout(logTimer.current)
    logTimer.current = null
    const entries = logQueue.current
    logQueue.current = []
    // One request per conversation: a reset can leave two ids in the queue
    for (const id of new Set(entries.map((entry) => entry.conversationId))) {
      fetch(`${BACKEND_URL}/api/chatbot/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          conversationId: id,
          messages: entries.filter((entry) => entry.conversationId === id).map(({ role, content }) => ({ role, content }))
        })
      }).catch(() => {})
    }
  }

  const queueLog = (role, content) => {
    if (!user || !content) return null
    const entry = { role, content, conversationId: conversationIdRef.current }
    logQueue.current.push(entry)
    if (!logTimer.current) logTimer.current = setTimeout(flushLog, 400)
    return entry
  }

  // Takes back a queued message that turned out to go to the AI (the server saves that one)
  const dropLog = (entry) => {
    logQueue.current = logQueue.current.filter((queued) => queued !== entry)
  }

  // `local` messages never go to the AI: they can contain gift card codes and PINs
  const say = (...items) => {
    const added = items.map((m) => ({ role: 'assistant', id: uid(), local: true, ...(typeof m === 'string' ? { content: m } : m) }))
    setMessages((prev) => [...prev, ...added])
    // AI replies (local: false) are already saved by the server
    added.filter((m) => m.local).forEach((m) => queueLog('assistant', m.content))
  }

  // log: false when the caller saves the message itself (typed text, see sendMessage)
  const sayUser = (content, local = true, log = local) => {
    setMessages((prev) => [...prev, { role: 'user', content, id: uid(), local }])
    if (log) queueLog('user', content)
  }

  // Typed text is saved as typed, except in the two sell steps where it is a gift card
  // code or a PIN. Returns the queued entry so it can be taken back if the AI handles it.
  const queueTyped = (text) => {
    const secret = Boolean(sell) && ['code', 'pin'].includes(sell.step)
    return queueLog('user', secret ? '[gift card code or PIN hidden]' : text)
  }

  // Buttons only work on the newest message, so an old step cannot be clicked again
  const isLatest = (msg) => messages[messages.length - 1]?.id === msg.id

  const goTo = (path) => {
    setIsOpen(false)
    navigate(path)
  }

  /* ---------- Sell a gift card ---------- */

  const startSell = () => {
    if (!user) {
      say('Please log in first so I can list the gift card on your account.', {
        type: 'options',
        options: [{ label: 'Log in / Sign up', action: 'nav:/login' }]
      })
      return
    }
    setRefundStep(null)
    setRefundItem(null)
    setSell({ step: 'brand' })
    say('Sure! Which gift card do you want to sell?', { type: 'brand_selector' })
  }

  const cancelSell = () => {
    setSell(null)
    say('No problem, I have cancelled the listing. Nothing was submitted.')
  }

  const selectBrand = (brand) => {
    const rate = getCommissionRate(brand)
    sayUser(brand)
    setSell({ step: 'balance', brand })
    say(`**${brand}** it is. Commission is ${rate}%, so you keep ${100 - rate}% of the card value.\n\nWhat is the balance on your card (in ₹)?`)
  }

  const askPinOrConfirm = (data) => {
    if (noPinBrands.includes(data.brand)) {
      showSummary({ ...data, pin: '' })
      return
    }
    setSell({ ...data, step: 'pin' })
    if (data.brand === 'Flipkart') {
      say('Now enter the **6-digit PIN** of your Flipkart card.')
    } else if (pinRequiredBrands.includes(data.brand)) {
      say(`Now enter the **PIN** of your ${data.brand} card. It is required.`)
    } else {
      say('Does your card have a PIN? Type it here, or tap **No PIN**.', {
        type: 'options',
        options: [{ label: 'No PIN', action: 'nopin' }]
      })
    }
  }

  const showSummary = (data) => {
    setSell({ ...data, step: 'confirm' })
    say('Please check the details before I list your card:', { type: 'sell_summary', data })
  }

  const handleSellInput = (text) => {
    if (/^(cancel|stop|exit|quit)$/i.test(text)) {
      cancelSell()
      return
    }

    if (sell.step === 'brand') {
      // A typed name only counts when it points to exactly one card ("amazon" matches two)
      const typed = text.toLowerCase()
      const partial = typed.length >= 4 ? brands.filter((b) => b.toLowerCase().includes(typed)) : []
      const match = brands.find((b) => b.toLowerCase() === typed) || (partial.length === 1 ? partial[0] : null)
      if (match) {
        const rate = getCommissionRate(match)
        setSell({ step: 'balance', brand: match })
        say(`**${match}** it is. Commission is ${rate}%, so you keep ${100 - rate}% of the card value.\n\nWhat is the balance on your card (in ₹)?`)
      } else {
        say('Please tap one of the gift cards above, or type "cancel" to stop.', { type: 'brand_selector' })
      }
      return
    }

    if (sell.step === 'balance') {
      const balance = Number(text.replace(/[₹,\s]|rs\.?|inr|rupees?/gi, ''))
      if (!Number.isFinite(balance) || balance < 1 || balance > 1000000) {
        say('Please type only the amount in numbers, for example **1000**.')
        return
      }
      const rounded = Math.round(balance)
      setSell({ ...sell, step: 'code', balance: rounded })
      say(
        `Got it. For a ${inr(rounded)} card you will receive **${inr(getPayout(sell.brand, rounded))}** after it sells.\n\n` +
        (sell.brand === 'Flipkart'
          ? 'Now send the **16-digit card number** of your Flipkart gift card.'
          : 'Now send your **gift card code**, exactly as it appears on the card, email or SMS.')
      )
      return
    }

    if (sell.step === 'code') {
      let code = text.trim()
      if (sell.brand === 'Flipkart') {
        code = code.replace(/[\s-]/g, '')
        if (!/^\d{16}$/.test(code)) {
          say('A Flipkart card number must be exactly **16 digits** (e.g. 6000170522107804). Please check and send it again.')
          return
        }
      } else if (code.length < 4 || code.length > 50) {
        say('That does not look like a valid gift card code. Please check and send it again.')
        return
      }
      askPinOrConfirm({ ...sell, code })
      return
    }

    if (sell.step === 'pin') {
      let pin = text.trim()
      const optional = !pinRequiredBrands.includes(sell.brand)
      if (optional && /^(no|no pin|none|skip|nahi|na)$/i.test(pin)) {
        showSummary({ ...sell, pin: '' })
        return
      }
      if (sell.brand === 'Flipkart') {
        pin = pin.replace(/\s/g, '')
        if (!/^\d{6}$/.test(pin)) {
          say('A Flipkart PIN must be exactly **6 digits**. Please check and send it again.')
          return
        }
      } else if (!pin || pin.length > 20) {
        say('That does not look like a valid PIN. Please check and send it again.')
        return
      }
      showSummary({ ...sell, pin })
      return
    }

    if (sell.step === 'confirm') {
      if (/^(yes|y|ok|okay|confirm|list|haan|ha|han)$/i.test(text)) submitSell()
      else if (/^(no|n|nahi)$/i.test(text)) cancelSell()
      else say('Tap **List my card** above to submit, or type "cancel" to stop.')
    }
  }

  const submitSell = async () => {
    if (!sell || sell.step !== 'confirm' || loading) return
    const { brand, balance, code, pin } = sell
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/gift-cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ brand, balance, code, pin: pin || '', expiry: '' })
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok && data.success) {
        setSell(null)
        say(
          `✅ Your **${brand}** gift card of ${inr(balance)} has been submitted for review.\n\nOur team will verify it and list it for sale. Once it sells, **${inr(getPayout(brand, balance))}** is sent to your bank account, usually within 3-4 hours.`,
          {
            type: 'options',
            options: [
              { label: 'View My Sales', action: 'nav:/my-sales' },
              { label: 'Add payout details', action: 'nav:/payout-details' },
              { label: 'Sell another card', action: 'sell' },
            ]
          }
        )
      } else if (res.status === 401) {
        setSell(null)
        say('Your session has expired. Please log in again and then list your card.', {
          type: 'options',
          options: [{ label: 'Log in', action: 'nav:/login' }]
        })
      } else {
        setSell(null)
        say(`I could not list the card: ${data.message || 'something went wrong'}.`, {
          type: 'options',
          options: [{ label: 'Try again', action: 'sell' }, { label: 'Open the Sell page', action: 'nav:/sell-gift-card' }]
        })
      }
    } catch {
      say('I could not reach the server. Please check your connection and tap **List my card** again.', { type: 'sell_summary', data: sell })
    } finally {
      setLoading(false)
    }
  }

  /* ---------- My sales ---------- */

  const showSales = async () => {
    if (!user) {
      say('Please log in to see the gift cards you have listed.', {
        type: 'options',
        options: [{ label: 'Log in / Sign up', action: 'nav:/login' }]
      })
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/gift-cards`, { credentials: 'include' })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error('Failed to fetch listings')

      if (data.data.length === 0) {
        say('You have not listed any gift cards yet.', {
          type: 'options',
          options: [{ label: 'Sell a gift card', action: 'sell' }]
        })
      } else {
        say(
          `Here are your latest listings (${data.data.length} in total):`,
          { type: 'sales_list', listings: data.data.slice(0, 5) },
          { type: 'options', options: [{ label: 'View all in My Sales', action: 'nav:/my-sales' }, { label: 'Sell another card', action: 'sell' }] }
        )
      }
    } catch {
      say('I could not load your sales right now. Please try again or open the My Sales page.', {
        type: 'options',
        options: [{ label: 'Open My Sales', action: 'nav:/my-sales' }]
      })
    } finally {
      setLoading(false)
    }
  }

  /* ---------- Refunds ---------- */

  const startRefund = async () => {
    if (!user) {
      say('Please log in to your account first so I can look up your orders and help you request a refund.', {
        type: 'options',
        options: [{ label: 'Log in / Sign up', action: 'nav:/login' }]
      })
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders/customer/${user.email}`, { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to fetch orders')
      const data = await res.json()

      if (data.success && data.data && data.data.length > 0) {
        setRefundStep('select_item')
        say('Here are your recent ordered items. Please click on the item you want to request a refund for:', {
          type: 'order_selector',
          orders: data.data
        })
      } else {
        say("I couldn't find any orders placed under your email address. If you made a purchase, please make sure you are logged into the correct account.")
      }
    } catch {
      say('I encountered an error checking your order history. Please try again or email us at support@redeemkart.in.')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectOrderItem = (item, orderId) => {
    sayUser(`I select: ${item.productName} (from Order #${orderId.slice(-6).toUpperCase()})`)
    setRefundItem(item)
    setRefundStep('ask_reason')
    say(`You selected **${item.productName}**. Please choose or type the reason for your refund request:`, {
      type: 'reason_selector',
      item
    })
  }

  const answerRefundReason = (reason) => {
    const textLower = reason.toLowerCase()
    let policyResponse = ''

    if (isGameItem(refundItem)) {
      if (['receive', 'get', 'not deliver', 'technical', 'error', 'download', 'install'].some((w) => textLower.includes(w))) {
        policyResponse = '**Refund Policy for Games**:\n\nGames are generally **non-refundable**. However, since you did not receive the game or got a technical error while downloading, our support team will verify this and **provide a new download link** to resolve any problem. Our team will contact you at your email address to assist with this!'
      } else {
        policyResponse = '**Refund Policy for Games**:\n\nPlease note that games are **non-refundable**. They are only refundable/replaceable if you **did not receive the game** or encountered a **technical error while downloading**, in which case our team will provide a new download link. For any other issues, please contact support@redeemkart.in.'
      }
    } else if (['invalid', 'not work', 'work', 'fail', 'expired'].some((w) => textLower.includes(w))) {
      policyResponse = '**Refund Policy for Vouchers/Gift Cards**:\n\nWe are sorry to hear that the code is invalid or not working. Since the code is invalid, we will process your refund back to your original payment method. The refund will be completed in **3-5 days**.'
    } else {
      policyResponse = '**Refund Policy for Vouchers/Gift Cards**:\n\nOur policy only permits refunds if the voucher code is **invalid or not working** (refund processed in **3-5 days**). For other issues, please contact support@redeemkart.in.'
    }

    say(policyResponse)
    setRefundStep(null)
    setRefundItem(null)
  }

  /* ---------- Games ---------- */

  const handleBuyGameDirectly = (game) => {
    addToCart({
      _id: game._id,
      name: game.fullName,
      price: game.price,
      originalPrice: game.originalPrice,
      images: game.img ? [game.img] : [],
    })
    goTo('/cart')
  }

  /* ---------- AI answer ---------- */

  const askAI = async (userText) => {
    setLoading(true)
    try {
      const history = messages
        .filter((m) => !m.type && !m.local && m.content)
        .map(({ role, content }) => ({ role, content }))
      history.push({ role: 'user', content: userText })

      const res = await fetch(`${BACKEND_URL}/api/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ messages: history, conversationId: conversationIdRef.current })
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) throw new Error(data.message || 'Backend error')

      say({ content: data.reply, local: false })
      if (!isOpen) setHasNewMessage(true)
    } catch (err) {
      say(err.message?.startsWith('Too many') ? err.message : 'Something went wrong. Please try again or email us at support@redeemkart.in')
    } finally {
      setLoading(false)
    }
  }

  /* ---------- Routing of what the user typed or tapped ---------- */

  const handleText = (userText) => {
    const textLower = userText.toLowerCase()

    if (sell) {
      handleSellInput(userText)
      return
    }

    if (refundStep === 'ask_reason' && refundItem) {
      answerRefundReason(userText)
      return
    }

    if (/\b(sell|selling|bech|bechna|bechni|bechu|bechun)\b/.test(textLower)) {
      startSell()
      return
    }

    if (/\b(my sales?|sales status|listing status|payout status|my listings?)\b/.test(textLower)) {
      showSales()
      return
    }

    if ((textLower.includes('game') && /\b(buy|purchase|get|want)\b/.test(textLower)) || textLower.includes('games page')) {
      say('RedeemKart offers discounted game keys and downloads! Here are the games available on our platform. Select one to buy or view details:', { type: 'game_selector' })
      return
    }

    if (textLower.includes('refund') || textLower.includes('return') || textLower.includes('not working')) {
      startRefund()
      return
    }

    askAI(userText)
    return true
  }

  const sendMessage = () => {
    const userText = input.trim()
    if (!userText || loading) return
    const queued = queueTyped(userText)
    // Anything typed during the sell flow may be a code or PIN, so it stays out of the AI history
    sayUser(userText, Boolean(sell), false)
    setInput('')
    if (handleText(userText)) dropLog(queued)
  }

  const runAction = (action, label) => {
    if (loading) return
    if (action.startsWith('nav:')) {
      goTo(action.slice(4))
    } else if (action.startsWith('text:')) {
      const text = action.slice(5)
      const queued = queueTyped(text)
      sayUser(text, false)
      if (handleText(text)) dropLog(queued)
    } else if (action === 'sell') {
      sayUser(label || 'I want to sell a gift card')
      startSell()
    } else if (action === 'sales') {
      sayUser(label || 'My sales status')
      showSales()
    } else if (action === 'rates') {
      sayUser(label || 'How much will I get?')
      say(RATES_TEXT, { type: 'options', options: [{ label: 'Sell a gift card', action: 'sell' }] })
    } else if (action === 'nopin' && sell?.step === 'pin') {
      sayUser('No PIN')
      showSummary({ ...sell, pin: '' })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const resetChat = () => {
    setMessages([welcome()])
    // Send what is still queued under the old id before a new conversation starts
    flushLog()
    conversationIdRef.current = uid()
    setRefundStep(null)
    setRefundItem(null)
    setSell(null)
    setInput('')
  }

  // Start a fresh chat when the account changes (login, logout) so the greeting and history match the user
  useEffect(() => {
    resetChat()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id])

  // The chatbot is for logged-in users only (the API rejects guests too)
  const canChat = Boolean(isAuthenticated && user)

  const inputLocked = refundStep === 'select_item'
  const placeholder = inputLocked
    ? 'Choose an item above...'
    : refundStep === 'ask_reason'
      ? 'Type reason...'
      : sell?.step === 'brand'
        ? 'Choose a gift card above...'
        : sell?.step === 'balance'
          ? 'Card balance, e.g. 1000'
          : sell?.step === 'code'
            ? 'Enter gift card code'
            : sell?.step === 'pin'
              ? 'Enter PIN'
              : sell?.step === 'confirm'
                ? 'Tap List my card above...'
                : 'Type your message...'

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-[60] w-14 h-14 bg-emerald-500 rounded-full shadow-xl hover:shadow-emerald-300/50 hover:scale-110 transition-all duration-200 flex items-center justify-center cursor-pointer"
        aria-label="Open support chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageCircle className="w-[22px] h-[22px] md:w-6 md:h-6 text-white" />
            {hasNewMessage && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
            )}
          </>
        )}
      </button>

      {/* Chat backdrop (mobile) */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed inset-0 md:bottom-28 md:right-8 md:top-auto md:left-auto z-[60] w-full md:w-[calc(100vw-2rem)] md:max-w-sm shadow-2xl md:rounded-2xl overflow-hidden flex flex-col bg-white h-full md:h-[600px] md:max-h-[calc(100vh-8rem)]">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-none">RedeemKart Support</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-[10px] font-medium">AI Assistant ● Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {canChat && <button
                onClick={resetChat}
                title="Reset chat"
                className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/10"
              >
                <RotateCcw className="w-4 h-4" />
              </button>}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Guests must log in or sign up before they can chat */}
          {!canChat && (
            <div className="flex-1 bg-slate-50 px-6 flex flex-col items-center justify-center text-center">
              {isAuthenticated === false && (
                <>
                  <span className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                    <Lock className="w-6 h-6" />
                  </span>
                  <p className="text-base font-semibold text-slate-900">Sign up to chat with us</p>
                  <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                    Create a free RedeemKart account or log in to sell gift cards, check your sales and get help from our assistant.
                  </p>
                  <button
                    onClick={() => goTo('/login')}
                    className="mt-5 w-full max-w-[240px] bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold py-2.5 rounded-xl cursor-pointer transition-colors"
                  >
                    Sign up / Log in
                  </button>
                </>
              )}
            </div>
          )}

          {/* Messages */}
          {canChat && (
          <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-3 space-y-3 flex flex-col">
            {messages.map((msg) => {
              if (msg.type === 'options') {
                return (
                  <div key={msg.id} className="flex flex-wrap gap-1.5 max-w-[90%] self-start pl-9">
                    {msg.options.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => runAction(opt.action, opt.label)}
                        disabled={!isLatest(msg) || loading}
                        className={optionBtnCls}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )
              }

              if (msg.type === 'brand_selector') {
                const active = isLatest(msg) && sell?.step === 'brand'
                return (
                  <div key={msg.id} className="bg-white border border-slate-100 rounded-2xl p-3 space-y-2 shadow-sm w-[90%] self-start">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Choose a gift card</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {brands.map((brand) => (
                        <button
                          key={brand}
                          onClick={() => selectBrand(brand)}
                          disabled={!active}
                          className="flex items-center gap-2 text-left p-2 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-50 disabled:hover:border-slate-200"
                        >
                          {brandLogos[brand] ? (
                            <img src={brandLogos[brand]} alt="" className="w-7 h-7 rounded-md object-cover shrink-0" />
                          ) : (
                            <span className="w-7 h-7 rounded-md bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                              <Gift className="w-3.5 h-3.5" />
                            </span>
                          )}
                          <span className="min-w-0">
                            <span className="block text-[11px] font-semibold text-slate-800 leading-tight">{brand}</span>
                            <span className="block text-[10px] text-emerald-700">You get {100 - getCommissionRate(brand)}%</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              }

              if (msg.type === 'sell_summary') {
                const d = msg.data
                const active = isLatest(msg) && sell?.step === 'confirm'
                const rate = getCommissionRate(d.brand)
                return (
                  <div key={msg.id} className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm w-[90%] self-start">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Your listing</p>
                    <dl className="text-xs divide-y divide-slate-100">
                      <div className="flex justify-between gap-3 py-1.5"><dt className="text-slate-500">Gift card</dt><dd className="font-semibold text-slate-800 text-right">{d.brand}</dd></div>
                      <div className="flex justify-between gap-3 py-1.5"><dt className="text-slate-500">Balance</dt><dd className="font-semibold text-slate-800">{inr(d.balance)}</dd></div>
                      <div className="flex justify-between gap-3 py-1.5"><dt className="text-slate-500">Code</dt><dd className="font-mono font-semibold text-slate-800 break-all text-right">{d.code}</dd></div>
                      {!noPinBrands.includes(d.brand) && (
                        <div className="flex justify-between gap-3 py-1.5"><dt className="text-slate-500">PIN</dt><dd className="font-mono font-semibold text-slate-800 break-all text-right">{d.pin || 'No PIN'}</dd></div>
                      )}
                      <div className="flex justify-between gap-3 py-1.5"><dt className="text-slate-500">Commission ({rate}%)</dt><dd className="font-semibold text-slate-800">-{inr(d.balance - getPayout(d.brand, d.balance))}</dd></div>
                      <div className="flex justify-between gap-3 py-1.5"><dt className="font-semibold text-slate-800">You receive</dt><dd className="font-semibold text-emerald-700">{inr(getPayout(d.brand, d.balance))}</dd></div>
                    </dl>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={submitSell}
                        disabled={!active || loading}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold py-2 rounded-xl cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading && active ? 'Listing...' : 'List my card'}
                      </button>
                      <button
                        onClick={cancelSell}
                        disabled={!active || loading}
                        className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 rounded-xl cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )
              }

              if (msg.type === 'sales_list') {
                return (
                  <div key={msg.id} className="bg-white border border-slate-100 rounded-2xl p-3 space-y-1.5 shadow-sm w-[90%] self-start">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Your gift cards</p>
                    {msg.listings.map((listing) => {
                      const status = SALE_STATUS[listing.status] || { label: listing.status, cls: 'bg-slate-100 text-slate-600' }
                      return (
                        <div key={listing._id} className="flex items-center justify-between gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">{listing.brand}</p>
                            <p className="text-[10px] text-slate-500">{inr(listing.balance)} card • you get {inr(getPayout(listing.brand, listing.balance))}</p>
                          </div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${status.cls}`}>{status.label}</span>
                        </div>
                      )
                    })}
                  </div>
                )
              }

              if (msg.type === 'order_selector') {
                return (
                  <div key={msg.id} className="bg-white border border-slate-100 rounded-2xl p-3 space-y-2 shadow-sm max-w-[90%] self-start">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Your Recent Items</p>
                    <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                      {msg.orders.map(order =>
                        order.items.map((item, idx) => (
                          <button
                            key={`${order._id}-${idx}`}
                            onClick={() => handleSelectOrderItem(item, order._id)}
                            disabled={refundStep !== 'select_item' || !isLatest(msg)}
                            className="w-full text-left text-xs p-2.5 bg-slate-50 hover:bg-violet-50 hover:border-violet-300 border border-slate-200 rounded-xl transition-all cursor-pointer flex justify-between items-center group font-medium"
                          >
                            <div className="truncate pr-2">
                              <p className="font-semibold text-slate-800 truncate group-hover:text-violet-900">{item.productName}</p>
                              <p className="text-[10px] text-slate-500">Order #{order._id.slice(-6).toUpperCase()} • ₹{item.productPrice}</p>
                            </div>
                            <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded group-hover:bg-violet-200 group-hover:text-violet-900 shrink-0">Select</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )
              }

              if (msg.type === 'reason_selector') {
                const reasons = isGameItem(msg.item)
                  ? ['Did not receive the game', 'Technical error while downloading', 'Code is invalid / not working', 'Other / Changed mind']
                  : ['Code is invalid / not working', 'Other / Changed mind']

                return (
                  <div key={msg.id} className="bg-white border border-slate-100 rounded-2xl p-3 space-y-2 shadow-sm max-w-[90%] self-start">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Select a Reason</p>
                    <div className="flex flex-col gap-1.5">
                      {reasons.map((reason) => (
                        <button
                          key={reason}
                          onClick={() => { sayUser(reason); answerRefundReason(reason) }}
                          disabled={refundStep !== 'ask_reason' || !isLatest(msg)}
                          className="w-full text-left text-xs px-3 py-2 bg-slate-50 hover:bg-violet-50 hover:border-violet-300 border border-slate-200 rounded-xl transition-all cursor-pointer font-medium text-slate-700 hover:text-violet-900"
                        >
                          {reason}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              }

              if (msg.type === 'game_selector') {
                return (
                  <div key={msg.id} className="w-[calc(100vw-4rem)] max-w-sm self-start overflow-hidden pr-2">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Available Games</p>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin snap-x">
                      {gamesList.map((game) => (
                        <div
                          key={game._id}
                          className="min-w-[140px] w-[140px] bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col snap-start shrink-0"
                        >
                          <div className="relative h-24 bg-slate-900 overflow-hidden">
                            {game.img ? (
                              <img
                                src={game.img}
                                alt={game.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-semibold px-1 bg-slate-800">
                                {game.name}
                              </div>
                            )}
                            <div className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full shadow">
                              -{Math.round(((game.originalPrice - game.price) / game.originalPrice) * 100)}%
                            </div>
                          </div>
                          <div className="p-2 flex flex-col flex-1 justify-between">
                            <div>
                              <h4 className="font-semibold text-slate-800 text-[11px] leading-tight line-clamp-2">{game.fullName || game.name}</h4>
                              <p className="text-xs font-black text-slate-950 mt-1">₹{game.price}</p>
                            </div>
                            <div className="flex flex-col gap-1 mt-2">
                              <button
                                onClick={() => handleBuyGameDirectly(game)}
                                className="w-full bg-violet-500 hover:bg-violet-600 text-white text-[10px] font-semibold py-1 rounded cursor-pointer transition-colors text-center"
                              >
                                Buy Now
                              </button>
                              <button
                                onClick={() => goTo(`/games/${game.slug}`)}
                                className="w-full bg-slate-950 hover:bg-slate-800 text-white text-[10px] font-medium py-1 rounded cursor-pointer transition-colors text-center"
                              >
                                Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }

              return (
                <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse self-end' : 'flex-row self-start'}`}>
                  {/* Avatar */}
                  {msg.role !== 'user' && (
                    <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold bg-violet-500 text-white">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  {/* Bubble */}
                  <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm whitespace-pre-line break-words ${
                    msg.role === 'assistant'
                      ? 'bg-white text-slate-800 rounded-tl-sm border border-slate-100'
                      : 'bg-gradient-to-br from-violet-500 to-violet-600 text-white rounded-tr-sm font-medium'
                  }`}>
                    {msg.role === 'assistant' ? renderText(msg.content) : msg.content}
                  </div>
                </div>
              )
            })}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2.5 self-start">
                <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          )}

          {/* Shortcuts, hidden while a sell or refund conversation is in progress */}
          {canChat && !loading && !refundStep && !sell && (
            <div className="bg-slate-50 px-3 pt-1 pb-2 flex gap-1.5 overflow-x-auto shrink-0">
              {QUICK_ACTIONS.map((q) => (
                <button
                  key={q.label}
                  onClick={() => runAction(q.action, q.label)}
                  className={`text-[11px] font-medium px-3 py-1.5 border rounded-full transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    q.action === 'sell'
                      ? 'bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-violet-500 hover:text-violet-800 hover:bg-violet-50'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          )}

          {canChat && sell && !loading && (
            <div className="bg-slate-50 px-3 pb-1.5 shrink-0">
              <button onClick={cancelSell} className="text-[11px] font-medium text-slate-500 hover:text-red-600 transition-colors cursor-pointer">
                Cancel selling
              </button>
            </div>
          )}

          {/* Input */}
          {canChat && (
          <div className="bg-white border-t border-slate-100 px-3 py-2.5 flex items-center gap-2 shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={loading || inputLocked}
              className="flex-1 text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition-all placeholder:text-slate-400 disabled:opacity-60"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim() || inputLocked}
              className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center hover:shadow-md hover:shadow-emerald-300/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0 active:scale-95"
            >
              <Send className="w-4 h-4 text-black" />
            </button>
          </div>
          )}
        </div>
      )}
    </>
  )
}

export default ChatBot
