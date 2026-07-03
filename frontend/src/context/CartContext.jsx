import React, { createContext, useContext, useReducer, useEffect } from 'react'
import axios from 'axios'
import { AppContext } from './AppContext'
import { games, bundleGameSlugs } from '../data/games'

const BUNDLE_ID = 'bundle-all-11'
const BUNDLE_IMAGES = bundleGameSlugs.map((slug) => games[slug]?.img).filter(Boolean)

const migrateCartItems = (items) => {
  return items.map((item) => {
    if ((item._id === BUNDLE_ID || item.id === BUNDLE_ID) && (!item.images || item.images.length <= 1)) {
      return { ...item, images: BUNDLE_IMAGES }
    }
    return item
  })
}

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      // Handle both _id and id fields for compatibility
      const productId = action.payload._id || action.payload.id
      const existingItem = state.items.find(item => 
        (item._id && item._id === productId) || (item.id && item.id === productId)
      )
      
      if (existingItem) {
        const maxLimit = action.payload.maxAddCartItem ?? 4;
        if (maxLimit !== null && existingItem.quantity + 1 > maxLimit) {
          return state; // Prevent adding beyond limit
        }
        return {
          ...state,
          items: state.items.map(item => {
            const itemId = item._id || item.id
            return itemId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          })
        }
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }]
        }
      }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => {
          const itemId = item._id || item.id
          return itemId !== action.payload
        })
      }

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item => {
          const itemId = item._id || item.id
          return itemId === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        }).filter(item => item.quantity > 0)
      }

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      }

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload || []
      }

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      }

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }

    default:
      return state
  }
}

const initialState = {
  items: [],
  loading: false,
  error: null
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { user, isAuthenticated, BACKEND_URL } = useContext(AppContext)

  // Load cart from localStorage or backend on mount/auth change
  useEffect(() => {
    const loadCart = async () => {
      // console.log('Loading cart. Auth status:', isAuthenticated, 'User:', user)
      
      if (isAuthenticated && user) {
        // User is logged in - fetch from backend
        try {
          dispatch({ type: 'SET_LOADING', payload: true })
          const response = await axios.get(`${BACKEND_URL}/api/cart`, {
            withCredentials: true
          })
          
          if (response.data.success) {
            // Transform backend cart format to frontend format
            let cartItems = response.data.cart.map(item => ({
              ...item.product,
              quantity: item.quantity,
              addedAt: item.addedAt
            }))
            cartItems = migrateCartItems(cartItems)
            dispatch({ type: 'LOAD_CART', payload: cartItems })
          }
        } catch (error) {
          console.error('Failed to load cart from backend:', error)
          dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' })
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } else if (isAuthenticated === false) {
        // User is not logged in - load from localStorage
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart)
          dispatch({ type: 'LOAD_CART', payload: migrateCartItems(parsedCart) })
        }
      }
    }

    loadCart()
  }, [isAuthenticated, user, BACKEND_URL])

  // Save to localStorage only for guest users
  useEffect(() => {
    if (isAuthenticated === false) {
      localStorage.setItem('cart', JSON.stringify(state.items))
    }
  }, [state.items, isAuthenticated])

  // Sync localStorage cart with backend when user logs in
  useEffect(() => {
    const syncCartOnLogin = async () => {
      if (isAuthenticated && user && state.items.length === 0) {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
          const localCartItems = JSON.parse(savedCart)
          if (localCartItems.length > 0) {
            try {
              const response = await axios.post(`${BACKEND_URL}/api/cart/sync`, {
                localCart: localCartItems
              }, {
                withCredentials: true
              })
              
              if (response.data.success) {
                const cartItems = response.data.cart.map(item => ({
                  ...item.product,
                  quantity: item.quantity,
                  addedAt: item.addedAt
                }))
                dispatch({ type: 'LOAD_CART', payload: cartItems })
                // Clear localStorage after successful sync
                localStorage.removeItem('cart')
              }
            } catch (error) {
              console.error('Failed to sync cart:', error)
            }
          }
        }
      }
    }

    syncCartOnLogin()
  }, [isAuthenticated, user, BACKEND_URL])

  const addToCart = async (product) => {
    const productId = product._id || product.id
    
    if (!productId) {
      console.error('Product missing id field:', product)
      return
    }

    if (isAuthenticated && user) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        const response = await axios.post(`${BACKEND_URL}/api/cart/add`, {
          product,
          quantity: 1
        }, {
          withCredentials: true
        })
        
        if (response.data.success) {
          const cartItems = response.data.cart.map(item => ({
            ...item.product,
            quantity: item.quantity,
            addedAt: item.addedAt
          }))
          dispatch({ type: 'LOAD_CART', payload: cartItems })
          return
        }
      } catch (error) {
        console.error('Backend cart add failed, falling back to local:', error)
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
      // Fallback: add locally if backend fails
      dispatch({ type: 'ADD_TO_CART', payload: product })
    } else {
      dispatch({ type: 'ADD_TO_CART', payload: product })
    }
  }

  const removeFromCart = async (productId) => {
    if (isAuthenticated && user) {
      // User is logged in - remove from backend
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        const response = await axios.delete(`${BACKEND_URL}/api/cart/remove/${productId}`, {
          withCredentials: true
        })
        
        if (response.data.success) {
          const cartItems = response.data.cart.map(item => ({
            ...item.product,
            quantity: item.quantity,
            addedAt: item.addedAt
          }))
          dispatch({ type: 'LOAD_CART', payload: cartItems })
        }
      } catch (error) {
        console.error('Failed to remove from cart:', error)
        dispatch({ type: 'SET_ERROR', payload: 'Failed to remove item from cart' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    } else {
      // Guest user - remove via reducer
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId })
    }
  }

  const updateQuantity = async (productId, quantity) => {
    if (isAuthenticated && user) {
      // User is logged in - update in backend
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        const response = await axios.put(`${BACKEND_URL}/api/cart/update/${productId}`, {
          quantity
        }, {
          withCredentials: true
        })
        
        if (response.data.success) {
          const cartItems = response.data.cart.map(item => ({
            ...item.product,
            quantity: item.quantity,
            addedAt: item.addedAt
          }))
          dispatch({ type: 'LOAD_CART', payload: cartItems })
        }
      } catch (error) {
        console.error('Failed to update cart quantity:', error)
        dispatch({ type: 'SET_ERROR', payload: 'Failed to update quantity' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    } else {
      // Guest user - update via reducer
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } })
    }
  }

  const clearCart = async () => {
    if (isAuthenticated && user) {
      // User is logged in - clear from backend
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        const response = await axios.delete(`${BACKEND_URL}/api/cart/clear`, {
          withCredentials: true
        })
        
        if (response.data.success) {
          dispatch({ type: 'CLEAR_CART' })
        }
      } catch (error) {
        console.error('Failed to clear cart:', error)
        dispatch({ type: 'SET_ERROR', payload: 'Failed to clear cart' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    } else {
      // Guest user - clear via reducer
      dispatch({ type: 'CLEAR_CART' })
    }
  }

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    items: state.items,
    loading: state.loading,
    error: state.error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}