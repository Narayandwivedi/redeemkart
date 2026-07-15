import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {

  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 text-gray-900 py-6 md:py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 via-blue-600/5 to-purple-600/5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-400/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="relative w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Layout */}
          <div className="lg:hidden space-y-3">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight">
                Build Your Dream
                <span className="block bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Gaming Setup
                </span>
              </h1>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-2 px-3 mb-3">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 text-xs">Quality Assured</h3>
                  <p className="text-gray-600 text-xs">Premium components</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 text-xs">24/7 Support</h3>
                  <p className="text-gray-600 text-xs">Always here</p>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative flex justify-center">
              <div className="relative max-w-xs w-full">
                <div className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-xl p-3 shadow-lg border border-gray-200 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-xl"></div>
                  
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-500/20 blur-lg"></div>
                  
                  <img 
                    src="/custom pc.webp" 
                    alt="Custom Gaming PC Setup" 
                    className="w-full h-auto object-contain relative z-20 max-h-36 mx-auto drop-shadow-lg"
                  />

                </div>

                {/* Background orbs */}
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col gap-2.5 justify-center pb-3 px-3">
              <Link 
                to="/pc-build" 
                className="group bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold text-sm py-2.5 px-6 rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center cursor-pointer flex items-center justify-center"
              >
                <span className="mr-2">ðŸš€</span>
                Build Your PC Now
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              
              <Link 
                to="/pc-parts" 
                className="group bg-white text-gray-700 font-medium text-sm py-2.5 px-6 rounded-xl border-2 border-gray-200 hover:border-cyan-300 hover:bg-cyan-50 transition-all duration-300 text-center cursor-pointer flex items-center justify-center"
              >
                <span className="mr-2">ðŸ›’</span>
                Browse PC Parts
              </Link>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
                  Build Your Dream
                  <span className="block bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Gaming Setup
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Experience ultimate performance with custom PC builds featuring premium components, advanced cooling systems, and professional assembly services.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col items-center lg:items-start space-y-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-center lg:text-left">
                    <h3 className="font-semibold text-gray-900 text-sm">Quality Assured</h3>
                    <p className="text-gray-600 text-xs">Premium components only</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center lg:items-start space-y-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-center lg:text-left">
                    <h3 className="font-semibold text-gray-900 text-sm">24/7 Support</h3>
                    <p className="text-gray-600 text-xs">Always here to help</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center lg:items-start space-y-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                  </div>
                  <div className="text-center lg:text-left">
                    <h3 className="font-semibold text-gray-900 text-sm">Expert Team</h3>
                    <p className="text-gray-600 text-xs">Professional guidance</p>
                  </div>
                </div>
              </div>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link 
                  to="/pc-build" 
                  className="group bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center cursor-pointer flex items-center justify-center"
                >
                  <span className="mr-2">ðŸš€</span>
                  Build Your PC Now
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                
                <Link 
                  to="/pc-parts" 
                  className="group bg-white text-gray-700 font-medium py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-cyan-300 hover:bg-cyan-50 transition-all duration-300 text-center cursor-pointer flex items-center justify-center"
                >
                  <span className="mr-2">ðŸ›’</span>
                  Browse PC Parts
                </Link>
              </div>
            </div>

            {/* Right Image Section */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative max-w-md w-full">
                {/* Main Image Container */}
                <div className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl p-6 shadow-xl border border-gray-200 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-2xl"></div>
                  
                  {/* Glowing border effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-500/20 blur-xl"></div>
                  
                  <img 
                    src="/custom pc.webp" 
                    alt="Custom Gaming PC Setup" 
                    className="w-full h-auto object-contain relative z-20 max-h-64 mx-auto drop-shadow-xl transition-all duration-700 hover:scale-105 hover:drop-shadow-[0_15px_35px_rgba(0,0,0,0.25)]"
                  />

                </div>

                {/* Enhanced Animated Background Elements */}
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-gradient-to-r from-blue-400/30 to-purple-500/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
