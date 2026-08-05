import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useSEO } from '../../hooks/useSEO';

const BlogsPage = () => {
  const { BACKEND_URL } = useContext(AppContext);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useSEO({
    title: 'Blog | Gift Card Tips, Voucher Guides & Deals | RedeemKart',
    description: 'Explore the RedeemKart blog for the latest tips on buying and selling gift cards, how to get maximum value from vouchers, game key guides, and exclusive deals in India.',
    keywords: 'gift card tips, sell gift card guide, buy discounted vouchers, RedeemKart blog, gift card deals india, google play voucher tips',
    ogImage: 'https://redeemkart.in/redeemkart-logo.png',
    canonicalUrl: 'https://redeemkart.in/blog'
  })

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      
      // Use demo data for now
      let filteredBlogs = demoBlogs;
      
      // Filter by search term
      if (searchTerm) {
        filteredBlogs = filteredBlogs.filter(blog => 
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setBlogs(filteredBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBlogs();
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'No date available';
    }
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date received:', dateString);
      return 'Invalid date';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${BACKEND_URL}${imagePath}`;
  };

  const truncateText = (text, limit) => {
    if (text.length <= limit) return text;
    return text.substring(0, limit) + '...';
  };

  return (
    <>
      {/* Schema markup for Blog page */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Blog - MySeries11",
            "description": "Latest cricket news and fantasy tips from MySeries11. Stay updated with cricket analysis, fantasy sports strategies, player insights, and expert predictions.",
            "url": "https://myseries11.com/blog",
            "mainEntity": {
              "@type": "Blog",
              "name": "MySeries11 Blog",
              "description": "Cricket news, fantasy tips, and expert analysis",
              "publisher": {
                "@type": "Organization",
                "name": "MySeries11",
                "url": "https://myseries11.com"
              }
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://myseries11.com/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Blog",
                  "item": "https://myseries11.com/blog"
                }
              ]
            }
          })
        }}
      />
      
      <div className="min-h-screen bg-gray-50">
      
      {/* Search and Filter Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full max-w-2xl">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search blogs..."
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="container mx-auto px-4 pt-5 pb-12 sm:py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-medium text-gray-700 mb-2">No blogs found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {blogs.map((blog) => (
              <Link 
                key={blog._id} 
                to={`/blog/${blog.slug}`}
                className="block"
              >
                <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                  {/* Blog Image or Alt Text */}
                  <div className="h-32 sm:h-56 lg:h-64 bg-gray-200" style={{ aspectRatio: '16/9' }}>
                    {blog.featuredImage ? (
                      <img
                        src={getImageUrl(blog.featuredImage)}
                        alt={blog.featuredImageAlt || blog.title}
                        className="w-full h-full object-cover"
                        width="1200"
                        height="675"
                      />
                    ) : blog.featuredImageAlt ? (
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 flex items-center justify-center p-4">
                        <div className="text-center">
                          <svg className="w-8 h-8 text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-blue-700 font-medium text-xs leading-tight">{blog.featuredImageAlt}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Blog Content */}
                  <div className="p-3 sm:p-6">
                    {/* Blog Title */}
                    <h2 className="text-sm sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                      {blog.title}
                    </h2>

                    {/* Blog Excerpt */}
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
                      {blog.excerpt}
                    </p>

                    {/* Blog Meta */}
                    <div className="flex items-center justify-between text-[11px] sm:text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </span>
                      </div>
                      <span className="text-blue-600 text-[11px] sm:text-xs font-medium">
                        <span className="sm:hidden">â†’</span>
                        <span className="hidden sm:inline">Read More â†’</span>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>

      </div>
    </>
  );
};

export default BlogsPage;
