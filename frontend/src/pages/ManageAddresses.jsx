import React from 'react'
import AddressManager from '../components/AddressManager'

const ManageAddresses = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Manage Addresses</h1>
          <p className="text-gray-600 mt-2">Add, edit, or remove your delivery addresses</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <AddressManager showSelection={false} />
        </div>
      </div>
    </div>
  )
}

export default ManageAddresses