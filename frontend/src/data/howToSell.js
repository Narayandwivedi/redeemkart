const SITE = 'https://redeemkart.in'
const UPDATED = { iso: '2026-09-25', label: '25 September 2026' }

const commonReceive = [
  'Flat 10% commission on every card',
  'You receive 90% of the card value',
  'Free to list, commission only on sale',
  'Exact payout shown before you publish',
]

const commonRelated = [
  { to: '/sell-gift-card', label: 'Sell any gift card on RedeemKart' },
  { to: '/gift-cards', label: 'Buy discounted gift cards' },
]

export const guides = {
  flipkart: {
    brand: 'Flipkart',
    path: '/how-to-sell-flipkart-gift-card',
    updated: UPDATED,
    seo: {
      title: 'How to Sell Flipkart Gift Card Online for Cash | RedeemKart',
      description: 'Learn how to sell your Flipkart gift card online in India. List the code and PIN on RedeemKart, keep 90% of the value and get paid in 3-4 hours.',
      keywords: 'how to sell flipkart gift card, sell flipkart gift card online, sell flipkart gift card for cash, sell unused flipkart gift card, flipkart gift card buyer india, sell flipkart voucher, RedeemKart',
    },
    intro: 'RedeemKart is one of the most popular platforms in India to sell Flipkart gift cards. If you have an unused Flipkart gift card, you can turn it into cash in a few minutes: list the card, let us verify it and receive the money in your bank account.',
    steps: [
      { title: 'Log in to RedeemKart', text: 'Sign in with your account. New here? Create one in under a minute.' },
      { title: 'Open the Sell Gift Card page', text: 'Choose Flipkart as the gift card and enter the balance shown on your card.' },
      { title: 'Enter the code and PIN', text: 'Add the 16-digit card number and the 6-digit PIN exactly as printed, then publish your listing.' },
      { title: 'We verify and list your card', text: 'Our team checks the card and puts it up for sale. Most popular cards sell within 24 hours.' },
      { title: 'Get paid in your bank account', text: 'After the sale, your payout is released to your bank account, usually within 3-4 hours.' },
    ],
    needs: ['16-digit Flipkart card number', '6-digit PIN', 'Card must be valid and unused', 'Bank account for the payout'],
    receive: commonReceive,
    example: { value: 1000, commission: 10 },
    tips: [
      'Check the card number and PIN twice before you publish. A wrong digit means the card is rejected.',
      'Make sure the card has not been redeemed or added to a Flipkart account.',
      'Enter the balance exactly as shown on the card.',
      'Add your bank details in Payout Details early so your payment is not delayed after the sale.',
    ],
    faqs: [
      { q: 'How do I sell a Flipkart gift card online?', a: 'Log in to RedeemKart, open the Sell Gift Card page, choose Flipkart, enter the balance, the 16-digit card number and the 6-digit PIN, then publish your listing. Once it sells, the money is sent to your bank account.' },
      { q: 'How much will I get for my Flipkart gift card?', a: 'A flat 10% commission is deducted from the card value, so you receive 90%. For example, a Rs. 1,000 card pays Rs. 900. The exact amount is shown on the sell page before you publish.' },
      { q: 'How long does the payment take?', a: 'Once your card is sold, the payout is usually released to your bank account in 3-4 hours.' },
      { q: 'Is it free to list a Flipkart gift card?', a: 'Yes. Listing is free. The commission is only deducted when your card sells.' },
      { q: 'What do I need to sell a Flipkart gift card?', a: 'The 16-digit card number and the 6-digit PIN. The card must be valid, unused and not expired.' },
      { q: 'Can I sell a Flipkart gift card without the PIN?', a: 'No. Flipkart cards need both the 16-digit card number and the 6-digit PIN.' },
      { q: 'What if my Flipkart gift card is invalid or already used?', a: 'It will be rejected during verification and no payment is made. Check the code and PIN carefully before you publish.' },
      { q: 'Which other gift cards can I sell on RedeemKart?', a: 'You can also sell Google Play, Amazon Pay, Amazon Shopping Voucher, Reliance JioMart, Steam, Myntra and BigBasket gift cards.' },
    ],
    related: [
      { to: '/how-to-sell-amazon-gift-card', label: 'How to sell an Amazon gift card' },
      ...commonRelated,
    ],
  },

  amazon: {
    brand: 'Amazon',
    path: '/how-to-sell-amazon-gift-card',
    updated: UPDATED,
    seo: {
      title: 'How to Sell Amazon Gift Card Online for Cash | RedeemKart',
      description: 'Learn how to sell your Amazon gift card online in India. List the code on RedeemKart, keep 90% of the value and get paid in your bank in 3-4 hours.',
      keywords: 'how to sell amazon gift card, sell amazon gift card online, sell amazon pay gift card, sell amazon gift card for cash, sell amazon voucher, amazon gift card buyer india, RedeemKart',
    },
    intro: 'RedeemKart is one of the most popular platforms in India to sell Amazon gift cards. If you have an unused Amazon Pay gift card or Amazon shopping voucher, you can turn it into cash in a few minutes: list the card, let us verify it and receive the money in your bank account.',
    steps: [
      { title: 'Log in to RedeemKart', text: 'Sign in with your account. New here? Create one in under a minute.' },
      { title: 'Open the Sell Gift Card page', text: 'Choose Amazon Pay Gift Card or Amazon Shopping Voucher and enter the balance shown on your card.' },
      { title: 'Enter the gift card code', text: 'Add the code exactly as it appears on your card or email, then publish your listing.' },
      { title: 'We verify and list your card', text: 'Our team checks the card and puts it up for sale. Most popular cards sell within 24 hours.' },
      { title: 'Get paid in your bank account', text: 'After the sale, your payout is released to your bank account, usually within 3-4 hours.' },
    ],
    needs: ['Amazon gift card code', 'Card must be valid and unused', 'Correct balance on the card', 'Bank account for the payout'],
    receive: commonReceive,
    example: { value: 1000, commission: 10 },
    tips: [
      'Copy the code exactly as it appears. Extra spaces or a wrong character will get the card rejected.',
      'Make sure the card has not been applied to an Amazon account.',
      'Enter the balance exactly as shown on the card.',
      'Add your bank details in Payout Details early so your payment is not delayed after the sale.',
    ],
    faqs: [
      { q: 'How do I sell an Amazon gift card online?', a: 'Log in to RedeemKart, open the Sell Gift Card page, choose Amazon Pay Gift Card or Amazon Shopping Voucher, enter the balance and the gift card code, then publish your listing. Once it sells, the money is sent to your bank account.' },
      { q: 'How much will I get for my Amazon gift card?', a: 'A flat 10% commission is deducted from the card value, so you receive 90%. For example, a Rs. 1,000 card pays Rs. 900. The exact amount is shown on the sell page before you publish.' },
      { q: 'How long does the payment take?', a: 'Once your card is sold, the payout is usually released to your bank account in 3-4 hours.' },
      { q: 'Which Amazon cards can I sell?', a: 'You can list Amazon Pay Gift Cards and Amazon Shopping Vouchers.' },
      { q: 'Do I need a PIN to sell an Amazon Pay gift card?', a: 'No. For an Amazon Pay Gift Card you only need to enter the gift card code.' },
      { q: 'Is it free to list an Amazon gift card?', a: 'Yes. Listing is free. The commission is only deducted when your card sells.' },
      { q: 'What if my Amazon gift card is invalid or already used?', a: 'It will be rejected during verification and no payment is made. Check the code carefully before you publish.' },
      { q: 'Which other gift cards can I sell on RedeemKart?', a: 'You can also sell Google Play, Flipkart, Reliance JioMart, Steam, Myntra and BigBasket gift cards.' },
    ],
    related: [
      { to: '/how-to-sell-flipkart-gift-card', label: 'How to sell a Flipkart gift card' },
      ...commonRelated,
    ],
  },
}

export const buildStructuredData = (g) => {
  const url = `${SITE}${g.path}`
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `How to sell a ${g.brand} gift card`,
      description: g.seo.description,
      mainEntityOfPage: url,
      image: `${SITE}/redeemkart-logo.png`,
      dateModified: g.updated.iso,
      datePublished: '2026-09-24',
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
      name: `How to Sell a ${g.brand} Gift Card on RedeemKart`,
      description: `Sell your unused ${g.brand} gift card on RedeemKart and get paid to your bank account.`,
      totalTime: 'PT5M',
      step: g.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.text })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: g.faqs.map((f) => ({
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
        { '@type': 'ListItem', position: 3, name: `How to Sell ${g.brand} Gift Card`, item: url },
      ],
    },
  ]
}

export const structuredDataId = (g) => `how-to-sell-${g.brand.toLowerCase()}-structured-data`
