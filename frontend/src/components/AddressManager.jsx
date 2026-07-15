import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const AddressManager = ({ onAddressSelect, selectedAddressId, showSelection = true }) => {
  const { BACKEND_URL, isAuthenticated, user } = useContext(AppContext)
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [formData, setFormData] = useState({
    type: 'home',
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    landmark: '',
    isDefault: false
  })

  // Fetch user addresses
  const fetchAddresses = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BACKEND_URL}/api/addresses`, {
        credentials: 'include'
      })
      const result = await response.json()
      
      if (result.success) {
        setAddresses(result.data)
      } else {
        if (response.status === 401) {
          toast.error('Please login to access addresses')
        } else {
          toast.error(result.message || 'Failed to fetch addresses')
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
      if (error.response?.status === 401) {
        toast.error('Please login to access addresses')
      } else {
        toast.error('Failed to fetch addresses')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAddresses()
    }
  }, [isAuthenticated, user])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const url = editingAddress 
        ? `${BACKEND_URL}/api/addresses/${editingAddress._id}`
        : `${BACKEND_URL}/api/addresses`
      
      const method = editingAddress ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast.success(editingAddress ? 'Address updated successfully' : 'Address added successfully')
        setShowAddForm(false)
        setEditingAddress(null)
        setFormData({
          type: 'home',
          fullName: '',
          phone: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'India',
          landmark: '',
          isDefault: false
        })
        fetchAddresses()
      } else {
        toast.error(result.message || 'Failed to save address')
      }
    } catch (error) {
      console.error('Error saving address:', error)
      toast.error('Failed to save address')
    }
  }

  const handleEdit = (address) => {
    setEditingAddress(address)
    setFormData({
      type: address.type,
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      landmark: address.landmark || '',
      isDefault: address.isDefault
    })
    setShowAddForm(true)
  }

  const handleDelete = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return
    }
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/addresses/${addressId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast.success('Address deleted successfully')
        fetchAddresses()
      } else {
        toast.error(result.message || 'Failed to delete address')
      }
    } catch (error) {
      console.error('Error deleting address:', error)
      toast.error('Failed to delete address')
    }
  }

  const handleSetDefault = async (addressId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/addresses/${addressId}/default`, {
        method: 'PATCH',
        credentials: 'include'
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast.success('Default address updated')
        fetchAddresses()
      } else {
        toast.error(result.message || 'Failed to update default address')
      }
    } catch (error) {
      console.error('Error setting default address:', error)
      toast.error('Failed to update default address')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Please login to manage addresses</p>
      </div>
    )
  }

  if (loading && addresses.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Address List */}
      {addresses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            {showSelection ? 'Select Delivery Address' : 'Your Addresses'}
          </h3>
          
          <div className="grid gap-4">
            {addresses.map((address) => (
              <div
                key={address._id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  showSelection && selectedAddressId === address._id
                    ? 'border-cyan-500 bg-cyan-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => showSelection && onAddressSelect && onAddressSelect(address._id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full capitalize">
                        {address.type}
                      </span>
                      {address.isDefault && (
                        <span className="bg-cyan-100 text-cyan-800 text-xs px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    
                    <p className="font-medium text-gray-900">{address.fullName}</p>
                    <p className="text-gray-600">{address.phone}</p>
                    <p className="text-gray-600 mt-1">
                      {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                    </p>
                    <p className="text-gray-600">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    {address.landmark && (
                      <p className="text-gray-500 text-sm">Landmark: {address.landmark}</p>
                    )}
                  </div>
                  
                  {!showSelection && (
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(address)}
                        className="text-cyan-600 hover:text-cyan-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefault(address._id)}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(address._id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Address Button */}
      <div>
        <button
          onClick={() => {
            setShowAddForm(true)
            setEditingAddress(null)
            setFormData({
              type: 'home',
              fullName: '',
              phone: '',
              addressLine1: '',
              addressLine2: '',
              city: '',
              state: '',
              postalCode: '',
              country: 'India',
              landmark: '',
              isDefault: addresses.length === 0
            })
          }}
          className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-cyan-500 hover:text-cyan-600 transition-colors"
        >
          + Add New Address
        </button>
      </div>

      {/* Add/Edit Address Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 1 *
              </label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="House/Flat/Building No., Street Name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 2
              </label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Area, Colony, Sector (Optional)"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Landmark
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Nearby landmark (Optional)"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
                className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Set as default address
              </label>
            </div>
            
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingAddress(null)
                }}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
              >
                {editingAddress ? 'Update Address' : 'Save Address'}
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 && !showAddForm && (
        <div className="text-center py-8">
          <p className="text-gray-500">No addresses saved yet.</p>
        </div>
      )}
    </div>
  )
}

export default AddressManager