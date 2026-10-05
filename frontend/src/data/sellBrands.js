// Gift cards that can be listed for sale, shared by the Sell Gift Card page and the chatbot.

export const brands = [
  'Google Play',
  'Flipkart',
  'Amazon Pay Gift Card',
  'Amazon Shopping Voucher',
  'Reliance JioMart Gift Card',
  'Steam',
  'Myntra',
  'MakeMyTrip',
  'PhonePe',
  'Zomato',
  'BigBasket',
]

export const brandLogos = {
  'Google Play': '/products/google%20play.avif',
  'Amazon Pay Gift Card': '/products/amazon.avif',
  'Amazon Shopping Voucher': '/products/amazon.avif',
  Flipkart: '/products/flipkart.avif',
  Steam: '/products/steam.avif',
  Myntra: '/products/myntra.avif',
  BigBasket: '/products/bigbasket.avif',
}

export const noPinBrands = ['Google Play', 'Amazon Pay Gift Card']

export const pinRequiredBrands = ['Flipkart', 'MakeMyTrip', 'PhonePe', 'Zomato']

const tenPercentBrands = ['Amazon', 'Amazon Pay Gift Card', 'Amazon Shopping Voucher', 'Flipkart', 'PhonePe']

// Seller commission in percent. Keep in sync with getCommissionRate in backend/controllers/giftCardController.js
export const getCommissionRate = (brand) => {
  if (tenPercentBrands.includes(brand)) return 10
  if (['Myntra', 'MakeMyTrip'].includes(brand)) return 20
  if (['Google Play', 'Zomato'].includes(brand)) return 25
  return 30
}

export const getPayout = (brand, balance) => Math.round((Number(balance) || 0) * (1 - getCommissionRate(brand) / 100))
