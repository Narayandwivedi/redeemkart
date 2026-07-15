import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)

  useSEO({
    title: product ? `${product.seoTitle || product.name} | GCHub` : 'Loading Product... | GCHub',
    description: product ? product.description?.substring(0, 160) : 'Buy gift cards and vouchers online at GCHub.',
    keywords: product ? `${product.brand}, ${product.name}, buy ${product.name}, gift card, GCHub` : 'gift card, GCHub',
    ogImage: product && product.images && product.images[0] ? product.images[0] : null,
    structuredData: product ? {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "image": product.images || [],
      "description": product.description,
      "brand": {
        "@type": "Brand",
        "name": product.brand
      },
      "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": "INR",
        "price": product.price,
        "availability": product.stockQuantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
      }
    } : null
  })

  const API_BASE_URL = 'http://localhost:5000'

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`)
      const data = await response.json()

      if (data.success) {
        setProduct(data.data)
        setError(null)
      } else {
        setError(data.message || 'Product not found')
      }
    } catch (err) {
      setError('Failed to fetch product details')
      console.error('Error fetching product:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const handleBuyNow = () => {
    // Add to cart logic or redirect to checkout
    alert('Buy Now functionality coming soon!')
  }

  const handleAddToCart = () => {
    // Add to cart logic
    alert('Product added to cart!')
  }

  const getSubcategoryUrl = (subCategory) => {
    const subcategoryMap = {
      'graphics-card': '/pc-parts/graphics-card',
      'processors': '/pc-parts/processors', 
      'memory': '/pc-parts/memory',
      'motherboards': '/pc-parts/motherboards',
      'storage': '/pc-parts/storage',
      'monitors': '/pc-parts/monitors',
      'keyboard': '/computer-accessories/keyboard',
      'mouse': '/computer-accessories/mouse',
      'headset': '/computer-accessories/headset',
      'gaming-laptop': '/laptops',
      'office-laptop': '/laptops'
    }
    return subcategoryMap[subCategory] || '/pc-parts'
  }

  const getSubcategoryDisplayName = (subCategory) => {
    const displayNames = {
      'graphics-card': 'Graphics Cards',
      'processors': 'Processors',
      'memory': 'Memory (RAM)',
      'motherboards': 'Motherboards', 
      'storage': 'Storage (SSD)',
      'monitors': 'Monitors',
      'keyboard': 'Keyboards',
      'mouse': 'Mouse',
      'headset': 'Headsets',
      'gaming-laptop': 'Gaming Laptops',
      'office-laptop': 'Office Laptops'
    }
    return displayNames[subCategory] || subCategory
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
            <span className="ml-3 text-gray-600">Loading Product Details...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-red-500 text-xl mb-4">{error}</div>
            <button
              onClick={() => navigate(-1)}
              className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <button onClick={() => navigate('/')} className="hover:text-cyan-600">
                Home
              </button>
            </li>
            <li>/</li>
            <li>
              <button 
                onClick={() => navigate(product.category === 'laptops' ? '/laptops' : '/pc-parts')} 
                className="hover:text-cyan-600"
              >
                {product.category === 'laptops' ? 'Laptops' : 'PC Parts'}
              </button>
            </li>
            {product.category !== 'laptops' && (
              <>
                <li>/</li>
                <li>
                  <button 
                    onClick={() => navigate(getSubcategoryUrl(product.subCategory))} 
                    className="hover:text-cyan-600"
                  >
                    {getSubcategoryDisplayName(product.subCategory)}
                  </button>
                </li>
              </>
            )}
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.seoTitle || product.name}
                  className="w-full h-full object-contain p-8"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <svg className="w-32 h-32 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer hover:border-cyan-400 transition-colors ${
                      selectedImage === index ? 'border-cyan-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.seoTitle || product.name} ${index + 1}`}
                      className="w-full h-full object-contain p-2 cursor-pointer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-medium text-gray-900 mb-4">
                {product.seoTitle || product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-sm text-gray-600">Brand:</span>
                <span className="font-medium text-gray-900">{product.brand}</span>
                {product.model && (
                  <>
                    <span className="text-sm text-gray-600">Model:</span>
                    <span className="font-medium text-gray-900">{product.model}</span>
                  </>
                )}
              </div>

              {product.sku && (
                <div className="text-sm text-gray-600 mb-4">
                  SKU: <span className="font-medium">{product.sku}</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-semibold text-cyan-600">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              
              <div className={`mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                product.stockQuantity > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                {product.stockQuantity > 0 && (
                  <span className="ml-2">({product.stockQuantity} available)</span>
                )}
              </div>

              {/* Warranty Information */}
              {product.warranty && (
                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2L3 7v3c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-7-5z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-gray-900">
                      {product.warranty === 0.5 ? '6 Months' : 
                       product.warranty === 1 ? '1 Year' : 
                       `${product.warranty} Years`} Warranty
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-6">
              <button
                onClick={handleBuyNow}
                disabled={product.stockQuantity <= 0}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
              
              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity <= 0}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium py-4 px-8 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
            </div>

            {/* Product Description */}
            {product.description && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-medium text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Key Features */}
            {product.features && product.features.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-medium text-gray-900 mb-4">Key Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-medium text-gray-900 mb-4">Specifications</h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="border-b border-gray-200 pb-2">
                        <dt className="text-sm font-medium text-gray-600">{key}</dt>
                        <dd className="text-sm text-gray-900 mt-1">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}

            {/* Physical Specifications */}
            {(product.weight || (product.dimensions && (product.dimensions.length || product.dimensions.width || product.dimensions.height))) && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-medium text-gray-900 mb-4">Physical Specifications</h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <dl className="space-y-2">
                    {product.weight && (
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-600">Weight</dt>
                        <dd className="text-sm text-gray-900">{product.weight}g</dd>
                      </div>
                    )}
                    {product.dimensions && (product.dimensions.length || product.dimensions.width || product.dimensions.height) && (
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-600">Dimensions (L Ã— W Ã— H)</dt>
                        <dd className="text-sm text-gray-900">
                          {product.dimensions.length || 'â€“'} Ã— {product.dimensions.width || 'â€“'} Ã— {product.dimensions.height || 'â€“'} cm
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail