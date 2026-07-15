import React, { useState, useRef, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, X, Send, Bot, User, Sparkles, RotateCcw } from 'lucide-react'
import { AppContext } from '../context/AppContext'
import { useCart } from '../context/CartContext'
import { gamesList } from '../data/games'

const QUICK_REPLIES = [
  'How do I get my voucher code?',
  'My code is not working',
  'I want a refund',
  'How to place an order?',
  'What payment methods do you accept?',
]

const ChatBot = () => {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user, BACKEND_URL } = useContext(AppContext)
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${user?.fullName?.split(' ')[0] || 'there'} ðŸ‘‹ I'm the GC Hub support bot! How can I help you today?`,
      id: 'welcome'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  
  // Refund Flow State
  const [refundStep, setRefundStep] = useState(null) // null, 'select_item', 'ask_reason'
  const [refundItem, setRefundItem] = useState(null)
  const [refundOrderId, setRefundOrderId] = useState(null)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

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
  }, [messages])

  const handleSelectOrderItem = (item, orderId) => {
    const userMsg = {
      role: 'user',
      content: `I select: ${item.productName} (from Order #${orderId.slice(-6).toUpperCase()})`,
      id: Date.now()
    }
    setMessages(prev => [...prev, userMsg])
    setRefundItem(item)
    setRefundOrderId(orderId)
    setRefundStep('ask_reason')

    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `You selected **${item.productName}**. Please choose or type the reason for your refund request:`,
        id: Date.now() + 1
      }, {
        role: 'assistant',
        id: 'reasons_selector_msg',
        type: 'reason_selector',
        item: item
      }])
    }, 400)
  }

  const handleSelectReason = (reason) => {
    sendMessage(reason)
  }

  const handleBuyGameDirectly = (game) => {
    // Add game to cart and navigate to cart page
    addToCart({
      _id: game._id,
      name: game.fullName,
      price: game.price,
      originalPrice: game.originalPrice,
      images: game.img ? [game.img] : [],
    })
    setIsOpen(false)
    navigate('/cart')
  }

  const sendMessage = async (text) => {
    const userText = text || input.trim()
    if (!userText || loading) return

    // Don't add user message again if it was already added by button clicks
    if (!text) {
      const userMsg = { role: 'user', content: userText, id: Date.now() }
      setMessages(prev => [...prev, userMsg])
      setInput('')
    }
    setLoading(true)

    const textLower = userText.toLowerCase()

    // 1. Intercept Buy Games Queries
    if (textLower.includes('buy game') || textLower.includes('purchase game') || textLower.includes('get game') || textLower.includes('want game') || textLower.includes('games page') || (textLower.includes('buy') && textLower.includes('game'))) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'ðŸŽ® GC Hub offers discounted game keys and downloads! Here are the games available on our platform. Select one to buy or view details:',
          id: Date.now() + 1
        }, {
          role: 'assistant',
          id: 'games_selector_msg',
          type: 'game_selector'
        }])
        setLoading(false)
      }, 600)
      return
    }

    // 2. If currently in 'ask_reason' step, process the refund reason input
    if (refundStep === 'ask_reason' && refundItem) {
      setTimeout(() => {
        const isGameItem = ['gta-5', 'rdr2', 'cyberpunk', 'the-last-of-us-2', 'resident-evil-4', 'san-andreas', 'the-witcher-3', 'god-of-war', 'cod-modern-warfare-2', 'mafia-3', 'forza-horizon-5', 'bundle-all-11'].includes(refundItem.productId) || 
                           refundItem.productBrand?.toLowerCase() === 'game' || 
                           refundItem.productName?.toLowerCase().includes('game')
        
        let policyResponse = ""
        
        if (isGameItem) {
          if (textLower.includes('receive') || textLower.includes('get') || textLower.includes('not deliver') || textLower.includes('technical') || textLower.includes('error') || textLower.includes('download') || textLower.includes('install')) {
            policyResponse = `ðŸŽ® **Refund Policy for Games**:\n\nGames are generally **non-refundable**. However, since you did not receive the game or got a technical error while downloading, our support team will verify this and **provide a new download link** to resolve any problem. Our team will contact you at your email address to assist with this!`
          } else {
            policyResponse = `ðŸŽ® **Refund Policy for Games**:\n\nPlease note that games are **non-refundable**. They are only refundable/replaceable if you **did not receive the game** or encountered a **technical error while downloading**, in which case our team will provide a new download link. For any other issues, please contact support@gchub.in.`
          }
        } else {
          // It's a voucher or gift card
          if (textLower.includes('invalid') || textLower.includes('not work') || textLower.includes('work') || textLower.includes('fail') || textLower.includes('expired')) {
            policyResponse = `ðŸŽŸï¸ **Refund Policy for Vouchers/Gift Cards**:\n\nWe are sorry to hear that the code is invalid or not working. Since the code is invalid, we will process your refund back to your original payment method. The refund will be completed in **3-5 days**.`
          } else {
            policyResponse = `ðŸŽŸï¸ **Refund Policy for Vouchers/Gift Cards**:\n\nOur policy only permits refunds if the voucher code is **invalid or not working** (refund processed in **3-5 days**). For other issues, please contact support@gchub.in.`
          }
        }

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: policyResponse,
          id: Date.now() + 1
        }])
        setRefundStep(null)
        setRefundItem(null)
        setRefundOrderId(null)
        setLoading(false)
      }, 800)
      return
    }

    // 3. Start refund flow if keyword matches
    if (textLower.includes('refund') || textLower.includes('return') || textLower.includes('not working')) {
      if (!user) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'ðŸ”’ Please log in to your account first so I can look up your orders and help you request a refund.',
          id: Date.now() + 1
        }])
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`${BACKEND_URL}/api/orders/customer/${user.email}`, {
          credentials: 'include'
        })
        if (!res.ok) throw new Error('Failed to fetch orders')
        const data = await res.json()
        
        if (data.success && data.data && data.data.length > 0) {
          setRefundStep('select_item')
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: 'ðŸ“‹ Here are your recent ordered items. Please click on the item you want to request a refund for:',
            id: 'select_item_instruction'
          }, {
            role: 'assistant',
            id: 'orders_selector_msg',
            type: 'order_selector',
            orders: data.data
          }])
        } else {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: 'ðŸ” I couldn\'t find any orders placed under your email address. If you made a purchase, please make sure you are logged into the correct account.',
            id: Date.now() + 1
          }])
        }
      } catch (err) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'âš ï¸ I encountered an error checking your order history. Please try again or email us at support@gchub.in.',
          id: Date.now() + 1
        }])
      } finally {
        setLoading(false)
      }
      return
    }

    // Default: call normal AI chatbot
    try {
      const history = messages
        .filter(m => !m.type) // exclude selectors
        .map(({ role, content }) => ({ role, content }))
      history.push({ role: 'user', content: userText })

      const res = await fetch(`${BACKEND_URL}/api/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ messages: history })
      })

      if (!res.ok) throw new Error('Backend error')
      const data = await res.json()
      if (!data.success) throw new Error(data.message)

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply,
        id: Date.now() + 1
      }])

      if (!isOpen) setHasNewMessage(true)
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'âš ï¸ Something went wrong. Please try again or email us at support@gchub.in',
        id: Date.now() + 1
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const resetChat = () => {
    setMessages([{
      role: 'assistant',
      content: `Hi ${user?.fullName?.split(' ')[0] || 'there'} ðŸ‘‹ I'm the GC Hub support bot! How can I help you today?`,
      id: 'welcome'
    }])
    setRefundStep(null)
    setRefundItem(null)
    setRefundOrderId(null)
    setInput('')
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-[60] w-14 h-14 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full shadow-xl hover:shadow-amber-300/50 hover:scale-110 transition-all duration-200 flex items-center justify-center cursor-pointer"
        aria-label="Open support chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-black" />
        ) : (
          <>
            <MessageCircle className="w-[22px] h-[22px] md:w-6 md:h-6 text-black" />
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
              <div className="w-9 h-9 bg-amber-400 rounded-full flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-none">GC Hub Support</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-[10px] font-medium">AI Assistant Â· Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={resetChat}
                title="Reset chat"
                className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/10"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-3 space-y-3 flex flex-col">
            {messages.map((msg) => {
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
                            disabled={refundStep !== 'select_item'}
                            className="w-full text-left text-xs p-2.5 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 rounded-xl transition-all cursor-pointer flex justify-between items-center group font-medium"
                          >
                            <div className="truncate pr-2">
                              <p className="font-semibold text-slate-800 truncate group-hover:text-amber-800">{item.productName}</p>
                              <p className="text-[10px] text-slate-500">Order #{order._id.slice(-6).toUpperCase()} Â· â‚¹{item.productPrice}</p>
                            </div>
                            <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded group-hover:bg-amber-200 group-hover:text-amber-800 shrink-0">Select</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )
              }

              if (msg.type === 'reason_selector') {
                const isGameItem = ['gta-5', 'rdr2', 'cyberpunk', 'the-last-of-us-2', 'resident-evil-4', 'san-andreas', 'the-witcher-3', 'god-of-war', 'cod-modern-warfare-2', 'mafia-3', 'forza-horizon-5', 'bundle-all-11'].includes(msg.item.productId) || 
                                   msg.item.productBrand?.toLowerCase() === 'game' || 
                                   msg.item.productName?.toLowerCase().includes('game')

                const reasons = isGameItem 
                  ? ['Did not receive the game', 'Technical error while downloading', 'Code is invalid / not working', 'Other / Changed mind']
                  : ['Code is invalid / not working', 'Other / Changed mind']

                return (
                  <div key={msg.id} className="bg-white border border-slate-100 rounded-2xl p-3 space-y-2 shadow-sm max-w-[90%] self-start">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Select a Reason</p>
                    <div className="flex flex-col gap-1.5">
                      {reasons.map((reason) => (
                        <button
                          key={reason}
                          onClick={() => handleSelectReason(reason)}
                          disabled={refundStep !== 'ask_reason'}
                          className="w-full text-left text-xs px-3 py-2 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 rounded-xl transition-all cursor-pointer font-medium text-slate-700 hover:text-amber-800"
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
                              <p className="text-xs font-black text-slate-950 mt-1">â‚¹{game.price}</p>
                            </div>
                            <div className="flex flex-col gap-1 mt-2">
                              <button
                                onClick={() => handleBuyGameDirectly(game)}
                                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black text-[10px] font-semibold py-1 rounded cursor-pointer transition-colors text-center"
                              >
                                Buy Now
                              </button>
                              <button
                                onClick={() => {
                                  navigate(`/games/${game.slug}`)
                                  setIsOpen(false)
                                }}
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
                    <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold bg-amber-400 text-black">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  {/* Bubble */}
                  <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm whitespace-pre-line ${
                    msg.role === 'assistant'
                      ? 'bg-white text-slate-800 rounded-tl-sm border border-slate-100'
                      : 'bg-gradient-to-br from-amber-400 to-yellow-500 text-black rounded-tr-sm font-medium'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              )
            })}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2.5 self-start">
                <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
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

          {/* Quick replies â€” only show when messages are few and not in refund flow */}
          {messages.length <= 2 && !loading && !refundStep && (
            <div className="bg-slate-50 px-3 pb-1 flex flex-wrap gap-1.5">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-[11px] font-medium px-3 py-1.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50 transition-all cursor-pointer whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="bg-white border-t border-slate-100 px-3 py-2.5 flex items-center gap-2 shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={refundStep === 'select_item' ? 'Choose an item above...' : refundStep === 'ask_reason' ? 'Type reason...' : 'Type your message...'}
              disabled={loading || refundStep === 'select_item'}
              className="flex-1 text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all placeholder:text-slate-400 disabled:opacity-60"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim() || refundStep === 'select_item'}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center hover:shadow-md hover:shadow-amber-300/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0 active:scale-95"
            >
              <Send className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatBot
