import React from 'react'
import { Link } from 'react-router-dom'

const AccessoriesSection = () => {
  const accessoryCategories = [
    {
      name: "Gaming Mouse",
      description: "Precision gaming mice for competitive edge",
      icon: "/mosue final.webp",
      features: ["RGB Lighting", "High DPI", "Ergonomic Design"],
      priceRange: "₹1,299 - ₹12,999",
      link: "/computer-accessories/mouse",
      gradient: "from-red-500 to-pink-600",
    },
    {
      name: "Keyboards",
      description: "Premium mechanical keyboards",
      icon: "/keyboard final.webp",
      features: ["Mechanical Switches", "RGB Backlighting", "Anti-Ghosting"],
      priceRange: "₹2,999 - ₹25,999",
      link: "/computer-accessories/keyboard",
      gradient: "from-blue-500 to-purple-600",
    },
    {
      name: "Gaming Headsets",
      description: "Immersive audio experience for gaming",
      icon: "/headset final.webp",
      features: ["Surround Sound", "Noise Cancellation", "Clear Mic"],
      priceRange: "₹1,599 - ₹18,999",
      link: "/computer-accessories/headset",
      gradient: "from-green-500 to-teal-600",
    },
    {
      name: "Webcams",
      description: "HD webcams for streaming and calls",
      icon: "/webcam.webp",
      features: ["4K Recording", "Auto Focus", "Wide Angle"],
      priceRange: "₹2,499 - ₹15,999",
      link: "/computer-accessories/webcam",
      gradient: "from-purple-500 to-indigo-600",
    },
    {
      name: "Gaming Chairs",
      description: "Ergonomic chairs for comfort",
      icon: "/gaming chair final.webp",
      features: ["Lumbar Support", "Adjustable Height", "Premium Materials"],
      priceRange: "₹8,999 - ₹45,999",
      link: "/computer-accessories/gaming-chair",
      gradient: "from-yellow-500 to-orange-600",
    },
    {
      name: "Laptop Bags",
      description: "Protective laptop carrying solutions",
      icon: "/laptop bag final.webp",
      features: ["Water Resistant", "Padded Protection", "Multiple Compartments"],
      priceRange: "₹899 - ₹8,999",
      link: "/computer-accessories/laptop-bag",
      gradient: "from-cyan-500 to-blue-600",
    }
  ];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Computer <span className="bg-gradient-to-r from-purple-500 via-pink-600 to-red-600 bg-clip-text text-transparent">Accessories</span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Enhance your setup with premium gaming peripherals and productivity accessories from top brands.
          </p>
        </div>

        {/* Accessories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {accessoryCategories.map((accessory, index) => (
            <Link
              key={index}
              to={accessory.link}
              className="group bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer block"
            >
              {/* Accessory Image */}
              <div className="mb-4 md:mb-6">
                <div className="relative w-full h-28 md:h-40 flex items-center justify-center mb-3 md:mb-4 bg-gray-50 rounded-xl overflow-hidden group-hover:bg-gray-100 transition-colors duration-300">
                  <img 
                    src={accessory.icon} 
                    alt={accessory.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <h3 className="text-base md:text-xl font-semibold text-gray-900 text-center mb-1 md:mb-2 group-hover:text-purple-600 transition-colors duration-300">
                  {accessory.name}
                </h3>
                
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed text-center mb-2 md:mb-3 hidden sm:block">
                  {accessory.description}
                </p>

                {/* Features - Only on medium and larger screens */}
                <div className="flex flex-wrap justify-center gap-1 mb-2 md:mb-4 hidden md:flex">
                  {accessory.features.slice(0, 3).map((feature, idx) => (
                    <span key={idx} className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full border border-purple-200">
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Price Range */}
                <div className="text-center mb-3 md:mb-4">
                  <span className="text-xs md:text-sm font-medium text-gray-900 bg-gray-100 px-2 md:px-3 py-1 rounded-full">
                    {accessory.priceRange}
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <div 
                className={`w-full bg-gradient-to-r ${accessory.gradient} text-white font-medium py-2 md:py-3 px-3 md:px-6 rounded-xl group-hover:opacity-90 transition-all duration-300 text-center shadow-md group-hover:shadow-lg transform group-hover:scale-[1.02] text-xs md:text-base`}
              >
                <span className="hidden sm:inline">Shop {accessory.name}</span>
                <span className="sm:hidden">Shop</span>
                <svg className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link 
            to="/computer-accessories"
            className="group inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-8 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            <span className="mr-2">🎮</span>
            View All Accessories
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-lg border border-purple-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Why Choose Our Accessories?</h3>
            <p className="text-gray-600">Premium quality accessories to enhance your gaming and productivity</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Gaming Grade</h4>
              <p className="text-gray-600 text-sm">Professional gaming peripherals for competitive play</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">RGB Lighting</h4>
              <p className="text-gray-600 text-sm">Customizable RGB lighting for perfect ambiance</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Warranty</h4>
              <p className="text-gray-600 text-sm">Comprehensive warranty coverage on all accessories</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Ergonomic</h4>
              <p className="text-gray-600 text-sm">Designed for comfort during long gaming sessions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AccessoriesSection