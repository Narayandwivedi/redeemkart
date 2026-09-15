import { toast } from 'react-toastify'

/**
 * Handles instant redemption: copies code to clipboard and opens target redeem page
 * @param {string} brand - Brand name (Google Play, Amazon, Flipkart, Steam, etc.)
 * @param {string} rawCode - Gift card code
 * @param {string} rawPin - Gift card PIN (optional)
 */
export const handleRedeemCode = (brand = '', rawCode = '', rawPin = '') => {
  const code = (rawCode || '').trim()
  const pin = (rawPin || '').trim()

  if (!code) {
    toast.error('No code available to redeem')
    return
  }

  // Copy code to clipboard
  try {
    navigator.clipboard.writeText(code)
  } catch (err) {
    console.error('Clipboard copy failed:', err)
  }

  const lowerBrand = brand.toLowerCase()
  let targetUrl = ''
  let toastMsg = `Code "${code}" copied!`

  if (lowerBrand.includes('google') || lowerBrand.includes('play store')) {
    targetUrl = `https://play.google.com/redeem?code=${encodeURIComponent(code)}`
    toastMsg = 'Google Play code copied! Opening Google Play redeem page...'
  } else if (lowerBrand.includes('amazon')) {
    targetUrl = 'https://www.amazon.in/apay-products/gc/claimCode/ref=in_apay_gc_allgc_halo1_addgc_pc_t1'
    toastMsg = 'Amazon code copied! Opening Amazon claim page...'
  } else if (lowerBrand.includes('flipkart')) {
    targetUrl = 'https://www.flipkart.com/account/giftcard'
    toastMsg = pin 
      ? `Flipkart code copied! PIN is: ${pin} (Opening Flipkart...)`
      : 'Flipkart code copied! Opening Flipkart gift card page...'
  } else if (lowerBrand.includes('steam')) {
    targetUrl = `https://store.steampowered.com/account/redeemwalletcode?wallet_code=${encodeURIComponent(code)}`
    toastMsg = 'Steam code copied! Opening Steam Wallet redeem page...'
  } else {
    toastMsg = `Code "${code}" copied to clipboard!`
  }

  toast.success(toastMsg)

  if (targetUrl) {
    window.open(targetUrl, '_blank', 'noopener,noreferrer')
  }
}
