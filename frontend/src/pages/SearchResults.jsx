import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchResults, setSearchResults] = useState([])
  const [facets, setFacets] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [searchInput, setSearchInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [originalSearchInput, setOriginalSearchInput] = useState('')
  const navigate = useNavigate()

  // Comprehensive suggestions based on popular e-commerce search terms
  const sampleSuggestions = [
    // Graphics Cards
    'Graphics Card',
    'Graphics Cards',
    'NVIDIA RTX 4090',
    'NVIDIA RTX 4080',
    'NVIDIA RTX 4070',
    'AMD RX 7900 XTX',
    'AMD RX 7800 XT',
    'RTX 4090',
    'RTX 4080',
    'RTX 4070',
    'Gaming Graphics Card',
    'GPU',
    'Video Card',
    
    // Laptops
    'Gaming Laptop',
    'Gaming Laptops',
    'Laptop',
    'Laptops',
    'Business Laptop',
    'Office Laptop',
    'Student Laptop',
    'Laptop Deals',
    'Cheap Laptop',
    'Best Laptop',
    'Laptop Under 30000',
    'Laptop Under 35000',
    'Laptop Under 40000',
    'Laptop Under 45000',
    'Laptop Under 50000',
    'Laptop Under 60000',
    'Laptop Under 70000',
    'Laptop Under 80000',
    'Laptop Under 100000',
    'HP Laptop',
    'Dell Laptop',
    'Lenovo Laptop',
    'ASUS Laptop',
    'MSI Laptop',
    
    // Processors
    'Processor',
    'Processors',
    'CPU',
    'Intel Core i9',
    'Intel Core i7',
    'Intel Core i5',
    'AMD Ryzen 9',
    'AMD Ryzen 7',
    'AMD Ryzen 5',
    'Gaming Processor',
    'Best Processor',
    
    // Memory
    'RAM',
    'RAM Memory',
    'DDR5 RAM',
    'DDR4 RAM',
    '16GB RAM',
    '32GB RAM',
    '64GB RAM',
    'Gaming RAM',
    'Corsair RAM',
    'G.Skill RAM',
    
    // Storage
    'SSD',
    'SSD Storage',
    'NVMe SSD',
    'M.2 SSD',
    '1TB SSD',
    '2TB SSD',
    'Samsung SSD',
    'WD SSD',
    'Kingston SSD',
    
    // Motherboards
    'Motherboard',
    'Motherboards',
    'Gaming Motherboard',
    'Intel Motherboard',
    'AMD Motherboard',
    'ASUS Motherboard',
    'MSI Motherboard',
    
    // Accessories
    'Gaming Keyboard',
    'Gaming Keyboards',
    'Mechanical Keyboard',
    'Wireless Keyboard',
    'RGB Keyboard',
    'Gaming Mouse',
    'Gaming Mice',
    'Wireless Mouse',
    'RGB Mouse',
    'Gaming Headset',
    'Gaming Headphones',
    'Wireless Headset',
    'Gaming Chair',
    'Computer Chair',
    'Ergonomic Chair',
    'Webcam',
    'Gaming Webcam',
    'HD Webcam',
    
    // Monitors
    'Monitor',
    'Monitors',
    'Gaming Monitor',
    '4K Monitor',
    'Curved Monitor',
    '27 Inch Monitor',
    '32 Inch Monitor',
    'Ultrawide Monitor',
    '144Hz Monitor',
    '240Hz Monitor',
    
    // Popular search terms
    'Best Gaming Setup',
    'PC Build',
    'Custom PC',
    'Gaming PC',
    'Office PC',
    'Workstation PC',
    'PC Parts',
    'Computer Parts',
    'Gaming Accessories',
    'Computer Accessories',
    'PC Components',
    'Gaming Gear',
    'RGB Setup',
    'Streaming Setup',
    'Content Creator Setup'
  ]

  // Get search parameters
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || 'all'
  const brand = searchParams.get('brand') || 'all'
  const sort = searchParams.get('sort') || 'relevance'
  const page = parseInt(searchParams.get('page')) || 1

  useEffect(() => {
    // Set the search input to match the URL query
    setSearchInput(query)
    if (query.trim()) {
      performSearch()
    }
  }, [searchParams])

  const performSearch = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (query) params.append('q', query)
      if (category && category !== 'all') params.append('category', category)
      if (brand && brand !== 'all') params.append('brand', brand)
      const apiSort =
        sort === 'total_cost_asc'
          ? 'price_asc'
          : sort === 'total_cost_desc'
            ? 'price_desc'
            : sort === 'per_acre_asc' || sort === 'per_acre_desc'
              ? 'relevance'
              : sort
      if (apiSort) params.append('sort', apiSort)
      if (page) params.append('page', page.toString())
      params.append('limit', '16')

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/search?${params}`)
      
      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      
      if (data.success) {
        setSearchResults(data.data)
        setFacets(data.facets || {})
        setTotalResults(data.total)
        setTotalPages(data.totalPages)
        setCurrentPage(data.page)
      } else {
        throw new Error(data.message || 'Search failed')
      }
    } catch (error) {
      console.error('Search error:', error)
      setError(error.message)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const updateSearchParams = (newParams) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    // Reset to page 1 when changing filters
    if (newParams.category || newParams.brand || newParams.sort) {
      params.set('page', '1')
    }
    setSearchParams(params)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const parseNumericValue = (value) => {
    if (typeof value === 'number' && Number.isFinite(value)) return value
    if (typeof value !== 'string') return null

    const cleaned = value.toLowerCase().replace(/,/g, '').trim()
    const match = cleaned.match(/-?\d+(\.\d+)?/)
    if (!match) return null

    const numericValue = Number.parseFloat(match[0])
    if (!Number.isFinite(numericValue)) return null

    if (cleaned.includes('crore') || /\bcr\b/.test(cleaned)) return numericValue * 10000000
    if (cleaned.includes('lakh') || cleaned.includes('lac')) return numericValue * 100000
    if (/\bk\b/.test(cleaned)) return numericValue * 1000
    return numericValue
  }

  const parseAreaInAcres = (value) => {
    const numericArea = parseNumericValue(value)
    if (!Number.isFinite(numericArea) || numericArea <= 0) return null

    if (typeof value === 'string') {
      const lower = value.toLowerCase()
      if (
        lower.includes('sq ft') ||
        lower.includes('sqft') ||
        lower.includes('square feet') ||
        lower.includes('ft2')
      ) {
        return numericArea / 43560
      }
      if (
        lower.includes('sq m') ||
        lower.includes('sqm') ||
        lower.includes('square meter') ||
        lower.includes('m2')
      ) {
        return numericArea / 4046.8564224
      }
      if (lower.includes('hectare') || /\bha\b/.test(lower)) {
        return numericArea * 2.47105
      }
    }

    return numericArea
  }

  const getLandValuePerAcre = (product) => {
    const directPerAcreCandidates = [
      product?.pricePerAcre,
      product?.perAcrePrice,
      product?.valuePerAcre,
      product?.landValuePerAcre,
    ]

    for (const candidate of directPerAcreCandidates) {
      const parsed = parseNumericValue(candidate)
      if (Number.isFinite(parsed) && parsed > 0) {
        return parsed
      }
    }

    const specifications =
      product?.specifications && typeof product.specifications === 'object'
        ? Object.entries(product.specifications)
        : []

    for (const [key, value] of specifications) {
      const normalizedKey = String(key).toLowerCase()
      if (
        /price\s*per\s*acre|value\s*per\s*acre|rate\s*per\s*acre|acre\s*price|acre\s*value/.test(
          normalizedKey,
        )
      ) {
        const parsed = parseNumericValue(value)
        if (Number.isFinite(parsed) && parsed > 0) {
          return parsed
        }
      }
    }

    const totalCost = parseNumericValue(product?.price ?? product?.totalCost ?? product?.totalPrice)
    if (!Number.isFinite(totalCost) || totalCost <= 0) return null

    const directAreaCandidates = [
      product?.areaInAcre,
      product?.acreage,
      product?.totalAcres,
      product?.landArea,
      product?.plotArea,
      product?.area,
    ]

    for (const candidate of directAreaCandidates) {
      const parsedArea = parseAreaInAcres(candidate)
      if (Number.isFinite(parsedArea) && parsedArea > 0) {
        return totalCost / parsedArea
      }
    }

    for (const [key, value] of specifications) {
      const normalizedKey = String(key).toLowerCase()
      if (/acre|land\s*area|plot\s*area|area\s*in\s*acre/.test(normalizedKey)) {
        const parsedArea = parseAreaInAcres(value)
        if (Number.isFinite(parsedArea) && parsedArea > 0) {
          return totalCost / parsedArea
        }
      }
    }

    return null
  }

  const compareNullableNumbers = (first, second, direction = 'asc') => {
    const firstIsValid = Number.isFinite(first)
    const secondIsValid = Number.isFinite(second)

    if (!firstIsValid && !secondIsValid) return 0
    if (!firstIsValid) return 1
    if (!secondIsValid) return -1

    return direction === 'asc' ? first - second : second - first
  }

  const displayedResults = useMemo(() => {
    const sortedResults = [...searchResults]

    if (sort === 'total_cost_asc' || sort === 'price_asc') {
      return sortedResults.sort((a, b) =>
        compareNullableNumbers(parseNumericValue(a?.price), parseNumericValue(b?.price), 'asc'),
      )
    }

    if (sort === 'total_cost_desc' || sort === 'price_desc') {
      return sortedResults.sort((a, b) =>
        compareNullableNumbers(parseNumericValue(a?.price), parseNumericValue(b?.price), 'desc'),
      )
    }

    if (sort === 'per_acre_asc') {
      return sortedResults.sort((a, b) =>
        compareNullableNumbers(getLandValuePerAcre(a), getLandValuePerAcre(b), 'asc'),
      )
    }

    if (sort === 'per_acre_desc') {
      return sortedResults.sort((a, b) =>
        compareNullableNumbers(getLandValuePerAcre(a), getLandValuePerAcre(b), 'desc'),
      )
    }

    return sortedResults
  }, [searchResults, sort])

  const handleProductClick = (product) => {
    // Navigate to product detail page using the same logic as other pages
    const categoryPath = product.category === 'laptops' ? 'laptops' : 'pc-parts'
    const subCategoryPath = product.category === 'laptops' ? product.subCategory : product.subCategory
    navigate(`/${categoryPath}/${subCategoryPath}/product/${product.slug || product._id}`)
  }

  const handlePageChange = (newPage) => {
    updateSearchParams({ page: newPage.toString() })
  }

  const handleNewSearch = () => {
    if (searchInput.trim() && searchInput.trim() !== query) {
      // Navigate to new search
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`)
    }
  }

  const handleSearchInputChange = (e) => {
    const value = e.target.value
    setSearchInput(value)
    setOriginalSearchInput(value)
    setSelectedSuggestionIndex(-1)
    
    if (value.length > 0) {
      const valueLower = value.toLowerCase().trim();
      
      // Smart filtering with priority system
      const suggestions = sampleSuggestions.map(suggestion => {
        const suggestionLower = suggestion.toLowerCase();
        let score = 0;
        let matches = false;

        // Highest priority: exact phrase match
        if (suggestionLower.includes(valueLower)) {
          matches = true;
          // Higher score for suggestions that start with the query
          if (suggestionLower.startsWith(valueLower)) {
            score = 100;
          } else {
            score = 80;
          }
        }
        
        // Medium priority: all words match in order
        const valueWords = valueLower.split(' ').filter(word => word.length > 1);
        if (valueWords.length > 1) {
          let allWordsMatch = true;
          let wordIndex = 0;
          
          for (const valueWord of valueWords) {
            const remainingSuggestion = suggestionLower.slice(wordIndex);
            const wordPosition = remainingSuggestion.indexOf(valueWord);
            
            if (wordPosition === -1) {
              allWordsMatch = false;
              break;
            }
            wordIndex += wordPosition + valueWord.length;
          }
          
          if (allWordsMatch && !matches) {
            matches = true;
            score = 60;
          }
        }
        
        // Lower priority: individual word matching
        if (!matches && valueWords.length > 0) {
          const suggestionWords = suggestionLower.split(' ');
          let matchingWords = 0;
          
          valueWords.forEach(valueWord => {
            if (suggestionWords.some(suggestionWord => 
              suggestionWord.startsWith(valueWord) || 
              suggestionWord.includes(valueWord)
            )) {
              matchingWords++;
            }
          });
          
          if (matchingWords > 0) {
            matches = true;
            // Score based on percentage of matching words
            score = (matchingWords / valueWords.length) * 40;
          }
        }

        return { suggestion, score, matches };
      })
      .filter(item => item.matches)
      .sort((a, b) => b.score - a.score)
      .map(item => item.suggestion)
      .slice(0, 10); // Show max 10 suggestions like Amazon

      const filteredSuggestions = suggestions;
      
      setSuggestions(filteredSuggestions)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedSuggestionIndex >= 0) {
        // Search with selected suggestion
        navigate(`/search?q=${encodeURIComponent(suggestions[selectedSuggestionIndex].trim())}`)
      } else {
        // Search with current input
        handleNewSearch()
      }
      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)
      return
    }

    if (!showSuggestions || suggestions.length === 0) {
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        const nextIndex = selectedSuggestionIndex < suggestions.length - 1 ? selectedSuggestionIndex + 1 : 0
        setSelectedSuggestionIndex(nextIndex)
        setSearchInput(suggestions[nextIndex])
        break
      case 'ArrowUp':
        e.preventDefault()
        const prevIndex = selectedSuggestionIndex > 0 ? selectedSuggestionIndex - 1 : suggestions.length - 1
        setSelectedSuggestionIndex(prevIndex)
        setSearchInput(suggestions[prevIndex])
        break
      case 'Escape':
        e.preventDefault()
        setSearchInput(originalSearchInput)
        setShowSuggestions(false)
        setSelectedSuggestionIndex(-1)
        break
      default:
        break
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchInput(suggestion)
    setOriginalSearchInput(suggestion)
    setShowSuggestions(false)
    setSelectedSuggestionIndex(-1)
  }

  const handleSearchFocus = () => {
    if (searchInput.length > 0) {
      setShowSuggestions(true)
    }
  }

  const handleSearchBlur = () => {
    setTimeout(() => {
      if (selectedSuggestionIndex >= 0) {
        setSearchInput(originalSearchInput)
      }
      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)
    }, 200)
  }

  if (!query.trim()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <div className="text-gray-400 mb-6">
              <svg className="w-20 h-20 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Search Query</h2>
            <p className="text-gray-600 mb-6">
              Please enter a search term to find products
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-colors font-medium"
            >
              Go Back to Homepage
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search PC parts, laptops..."
                value={searchInput}
                onChange={handleSearchInputChange}
                onKeyDown={handleSearchKeyDown}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className="w-full pl-10 pr-16 sm:pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-gray-900 placeholder-gray-500 text-sm sm:text-base"
              />
              <div className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center">
                <button
                  onClick={handleNewSearch}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-2 sm:px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center"
                >
                  <svg className="w-4 h-4 sm:hidden" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>

            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`px-4 py-2 cursor-pointer text-gray-900 border-b border-gray-100 last:border-b-0 transition-colors ${
                      index === selectedSuggestionIndex 
                        ? 'bg-cyan-50 text-cyan-900' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <svg className={`h-4 w-4 ${
                        index === selectedSuggestionIndex ? 'text-cyan-500' : 'text-gray-400'
                      }`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                      <span>{suggestion}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Search Results for: <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">"{query}"</span>
              </h1>
              {!loading && (
                <p className="text-gray-600 mt-1">
                  {totalResults} results found
                </p>
              )}
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-cyan-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Controls */}
        {!loading && searchResults.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left Controls */}
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Category Filter */}
                {facets.categories && facets.categories.length > 1 && (
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={category}
                      onChange={(e) => updateSearchParams({ category: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    >
                      <option value="all">All Categories</option>
                      {facets.categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Brand Filter */}
                {facets.brands && facets.brands.length > 1 && (
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                    <select
                      value={brand}
                      onChange={(e) => updateSearchParams({ brand: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    >
                      <option value="all">All Brands</option>
                      {facets.brands.map(brandName => (
                        <option key={brandName} value={brandName}>{brandName}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Sort */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sort}
                    onChange={(e) => updateSearchParams({ sort: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  >
                    <option value="relevance">Most Relevant</option>
                    <option value="total_cost_desc">Total Cost: Highest to Lowest</option>
                    <option value="total_cost_asc">Total Cost: Lowest to Highest</option>
                    <option value="per_acre_desc">Land Value Per Acre: Highest to Lowest</option>
                    <option value="per_acre_asc">Land Value Per Acre: Lowest to Highest</option>
                    <option value="newest">Newest First</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching products...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Search Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={performSearch}
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && displayedResults.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-6">
              <svg className="w-20 h-20 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any products matching "{query}"
            </p>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">Try:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>â€¢ Checking your spelling</li>
                <li>â€¢ Using more general terms</li>
                <li>â€¢ Trying different keywords</li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/')}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-colors font-medium"
            >
              Browse All Products
            </button>
          </div>
        )}

        {/* Search Results Grid */}
        {!loading && !error && displayedResults.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {displayedResults.map((product) => (
                <div 
                  key={product._id} 
                  className="group cursor-pointer transition-all duration-300 bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-500/25 transform hover:scale-105"
                  onClick={() => handleProductClick(product)}
                >
                  {/* Product Image */}
                  <div className="h-40 sm:h-48 bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5"></div>
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.seoTitle || product.name}
                        className="max-h-full max-w-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Product'
                        }}
                      />
                    ) : (
                      <div className="text-gray-400 relative z-10">
                        <svg className="w-8 h-8 sm:w-12 sm:h-12" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-3 sm:p-4">
                    {/* Brand and Category */}
                    <div className="flex items-center gap-1 sm:gap-2 mb-2">
                      <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-cyan-100 text-cyan-800 text-xs rounded-full font-medium">
                        {product.brand}
                      </span>
                      <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                        {product.category}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-cyan-700 transition-colors text-sm sm:text-lg line-clamp-2 leading-tight">
                      {product.seoTitle || product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex flex-col">
                        <span className="text-lg sm:text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs sm:text-sm text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      
                      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-1.5 sm:p-2 rounded-lg group-hover:shadow-lg group-hover:shadow-cyan-500/25 transition-shadow">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center justify-between">
                      <div>
                        {product.stockQuantity > 0 ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                            <span className="hidden sm:inline">In Stock</span>
                            <span className="sm:hidden">Stock</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1"></div>
                            <span className="text-[10px] sm:text-xs">Out of Stock</span>
                          </span>
                        )}
                      </div>
                      
                      {/* Savings Amount */}
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-green-600 font-semibold text-xs sm:text-sm">
                          <span className="hidden sm:inline">Save </span>
                          {formatPrice(product.originalPrice - product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center space-x-2">
                {/* Previous button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page numbers */}
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        pageNumber === currentPage
                          ? 'bg-cyan-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  )
                })}

                {/* Next button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default SearchResults
