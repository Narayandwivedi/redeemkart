import React from 'react'
import HowToSellGuide from '../components/HowToSellGuide'

const config = {
  brand: 'Flipkart',
  path: '/how-to-sell-flipkart-gift-card',
  seo: {
    title: 'How to Sell Flipkart Gift Card Online | RedeemKart',
    description: 'Step-by-step guide to sell your Flipkart gift card on RedeemKart. List the code and PIN, get it verified and receive the money in your bank account in about 3-4 hours.',
    keywords: 'how to sell flipkart gift card, sell flipkart gift card online, sell flipkart voucher, flipkart gift card cash, RedeemKart',
  },
  intro: 'RedeemKart is one of the most popular platforms in India to sell Flipkart gift cards. List your unused card, get it verified and receive the money in your bank account.',
  steps: [
    { title: 'Log in to RedeemKart', text: 'Sign in with your account. New here? Create one in under a minute.' },
    { title: 'Open the Sell Gift Card page', text: 'Choose Flipkart as the brand and enter the balance on your card.' },
    { title: 'Enter the code and PIN', text: 'Add the 16-digit card number and the 6-digit PIN exactly as printed, then publish your listing.' },
    { title: 'We verify and list your card', text: 'Our team checks the card and puts it up for sale. Most popular cards sell within 24 hours.' },
    { title: 'Get paid in your bank account', text: 'After the sale, your payout is released to your bank account, usually within 3-4 hours.' },
  ],
  needs: ['16-digit Flipkart card number', '6-digit PIN', 'Card must be valid and unused', 'Bank account for the payout'],
  receive: ['Flat 10% commission on every card', 'You receive 90% of the card value', 'No fee to list, paid only on sale', 'Your exact payout shows before you publish'],
  faqs: [
    { q: 'How much will I get for my Flipkart gift card?', a: 'A flat 10% commission is deducted from the card value, so you receive 90%. The exact amount is shown on the sell page before you publish.' },
    { q: 'How long does the payment take?', a: 'Once your card is sold, the payout is usually released in 3-4 hours.' },
    { q: 'Is it free to list a card?', a: 'Yes. Listing is free. The commission is only deducted when your card sells.' },
    { q: 'What do I need to sell a Flipkart gift card?', a: 'The 16-digit card number and the 6-digit PIN. The card must be valid, unused and not expired.' },
    { q: 'Can I sell a card with a partial balance?', a: 'Yes. Enter the current balance on the card when you list it.' },
    { q: 'What if my card is invalid or already used?', a: 'It will be rejected during verification and no payment is made. Check the code and PIN carefully before you publish.' },
  ],
}

const HowToSellFlipkartGiftCard = () => <HowToSellGuide {...config} />

export default HowToSellFlipkartGiftCard
