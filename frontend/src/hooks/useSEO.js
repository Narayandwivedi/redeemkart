import { useEffect } from 'react'

export const useSEO = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterSite = '@redeemkart',
  canonicalUrl,
  noindex = false,
  structuredData,
  structuredDataId = 'seo-structured-data'
}) => {
  useEffect(() => {
    // 1. Title
    if (title) {
      document.title = title
    }

    const setMetaTag = (name, content, property = false) => {
      if (!content) return
      const attribute = property ? 'property' : 'name'
      let meta = document.querySelector(`meta[${attribute}="${name}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attribute, name)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    // 2. Standard Meta Tags
    setMetaTag('description', description)
    setMetaTag('keywords', keywords)
    setMetaTag('robots', noindex ? 'noindex, follow' : 'index, follow')

    // 3. Open Graph
    setMetaTag('og:title', ogTitle || title, true)
    setMetaTag('og:description', ogDescription || description, true)
    setMetaTag('og:type', ogType, true)
    setMetaTag('og:site_name', 'RedeemKart', true)
    setMetaTag('og:locale', 'en_IN', true)
    // Normalise URL: strip query string for canonical-like og:url
    const cleanUrl = window.location.origin + window.location.pathname
    setMetaTag('og:url', canonicalUrl || cleanUrl, true)
    if (ogImage) {
      setMetaTag('og:image', ogImage, true)
      setMetaTag('og:image:width', '1200', true)
      setMetaTag('og:image:height', '630', true)
    }

    // 4. Twitter
    setMetaTag('twitter:card', twitterCard, true)
    setMetaTag('twitter:site', twitterSite, true)
    setMetaTag('twitter:title', ogTitle || title, true)
    setMetaTag('twitter:description', ogDescription || description, true)
    if (ogImage) {
      setMetaTag('twitter:image', ogImage, true)
    }

    // 5. Canonical Link — always use clean URL (no query string) unless explicitly provided
    const finalCanonicalUrl = canonicalUrl || (window.location.origin + window.location.pathname)
    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute('href', finalCanonicalUrl)

    // 6. Structured Data Schema (supports single object or array)
    const injectedScripts = []
    if (structuredData) {
      const schemas = Array.isArray(structuredData) ? structuredData : [structuredData]
      schemas.forEach((schema, index) => {
        const id = index === 0 ? structuredDataId : `${structuredDataId}-${index}`
        let script = document.querySelector(`#${id}`)
        if (!script) {
          script = document.createElement('script')
          script.id = id
          script.type = 'application/ld+json'
          document.head.appendChild(script)
        }
        script.textContent = JSON.stringify(schema)
        injectedScripts.push(script)
      })
    }

    // Cleanup
    return () => {
      injectedScripts.forEach(script => script.remove())
    }
  }, [
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    twitterCard,
    twitterSite,
    canonicalUrl,
    noindex,
    structuredData,
    structuredDataId
  ])
}
