import React from 'react'
import HowToSellGuide from '../components/HowToSellGuide'

const config = {
  brand: 'Amazon',
  path: '/how-to-sell-amazon-gift-card',
  seo: {
    title: 'How to Sell Amazon Gift Card Online | RedeemKart',
    description: 'Step-by-step guide to sell your Amazon gift card on RedeemKart. List the code, get it verified and receive the money in your bank account in about 3-4 hours.',
    keywords: 'how to sell amazon gift card, sell amazon gift card online, sell amazon pay gift card, sell amazon voucher, amazon gift card cash, RedeemKart',
  },
  intro: 'RedeemKart is one of the most popular platforms in India to sell Amazon gift cards. List your unused Amazon Pay gift card or shopping voucher, get it verified and receive the money in your bank account.',
  steps: [
    { title: 'Log in to RedeemKart', text: 'Sign in with your account. New here? Create one in under a minute.' },
    { title: 'Open the Sell Gift Card page', text: 'Choose Amazon Pay Gift Card or Amazon Shopping Voucher as the brand and enter the balance on your card.' },
    { title: 'Enter the gift card code', text: 'Add the code exactly as it appears on your card or email, then publish your listing.' },
    { title: 'We verify and list your card', text: 'Our team checks the card and puts it up for sale. Most popular cards sell within 24 hours.' },
    { title: 'Get paid in your bank account', text: 'After the sale, your payout is released to your bank account, usually within 3-4 hours.' },
  ],
  needs: ['Amazon gift card code', 'Card must be valid and unused', 'Correct balance on the card', 'Bank account for the payout'],
  receive: ['Flat 10% commission on every card', 'You receive 90% of the card value', 'No fee to list, paid only on sale', 'Your exact payout shows before you publish'],
  faqs: [
    { q: 'How much will I get for my Amazon gift card?', a: 'A flat 10% commission is deducted from the card value, so you receive 90%. The exact amount is shown on the sell page before you publish.' },
    { q: 'How long does the payment take?', a: 'Once your card is sold, the payout is usually released in 3-4 hours.' },
    { q: 'Which Amazon cards can I sell?', a: 'You can list Amazon Pay Gift Cards and Amazon Shopping Vouchers.' },
    { q: 'Is it free to list a card?', a: 'Yes. Listing is free. The commission is only deducted when your card sells.' },
    { q: 'What if my card is invalid or already used?', a: 'It will be rejected during verification and no payment is made. Check the code carefully before you publish.' },
  ],
}

const HowToSellAmazonGiftCard = () => <HowToSellGuide {...config} />

export default HowToSellAmazonGiftCard
