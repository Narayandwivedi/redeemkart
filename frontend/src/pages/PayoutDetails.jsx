import React, { useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { Building2, Banknote, Save, X, Loader, Edit2, CheckCircle, AlertCircle } from 'lucide-react'

const PayoutDetails = () => {
  const { user, BACKEND_URL, setUser } = useContext(AppContext)
  const hasExistingPayout = user?.bankAccountHolder || user?.bankAccountNumber || user?.bankName || user?.ifscCode
  const [isEditing, setIsEditing] = useState(!hasExistingPayout)
  const [formData, setFormData] = useState({
    bankAccountHolder: user?.bankAccountHolder || '',
    bankAccountNumber: user?.bankAccountNumber || '',
    bankName: user?.bankName || '',
    ifscCode: user?.ifscCode || '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      })
      const result = await response.json()
      if (result.success) {
        toast.success('Payout details saved')
        setUser(result.user)
        setIsEditing(false)
      } else {
        throw new Error(result.message || 'Failed to save')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save payout details')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      bankAccountHolder: user?.bankAccountHolder || '',
      bankAccountNumber: user?.bankAccountNumber || '',
      bankName: user?.bankName || '',
      ifscCode: user?.ifscCode || '',
    })
    setIsEditing(false)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const hasBank = formData.bankAccountHolder && formData.bankAccountNumber && formData.bankName && formData.ifscCode

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Payout Details</h1>
          <p className="text-sm text-gray-500 mt-1">Manage how you receive payments from us</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black px-5 sm:px-6 py-6">
            <div className="flex items-center gap-4">
              <div className="bg-violet-500 p-3 rounded-full shrink-0">
                <Banknote className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-white">Payout Settings</h2>
                <p className="text-violet-200 text-sm mt-0.5">Add your bank account for payouts</p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">

                {/* Bank Account */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                    <Building2 className="w-4 h-4 text-violet-500" />
                    Bank Account
                  </div>

                  {!isEditing && hasBank && (
                    <div className="flex items-center gap-2 text-xs text-green-600 mb-3 bg-green-50 px-3 py-2 rounded-lg">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      Bank account added
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Account Holder Name</label>
                      <input type="text" name="bankAccountHolder" value={formData.bankAccountHolder} onChange={handleChange} disabled={!isEditing} placeholder="Name on bank account"
                        className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all duration-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                          !isEditing ? 'bg-gray-50 border-gray-200 text-gray-700 cursor-not-allowed' : 'border-gray-300 bg-white'
                        }`} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Account Number</label>
                      <input type="text" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleChange} disabled={!isEditing} placeholder="Enter account number"
                        className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all duration-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                          !isEditing ? 'bg-gray-50 border-gray-200 text-gray-700 cursor-not-allowed' : 'border-gray-300 bg-white'
                        }`} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Bank Name</label>
                      <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} disabled={!isEditing} placeholder="e.g. SBI, HDFC"
                        className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all duration-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                          !isEditing ? 'bg-gray-50 border-gray-200 text-gray-700 cursor-not-allowed' : 'border-gray-300 bg-white'
                        }`} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">IFSC Code</label>
                      <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} disabled={!isEditing} placeholder="e.g. SBIN0001234"
                        className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all duration-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                          !isEditing ? 'bg-gray-50 border-gray-200 text-gray-700 cursor-not-allowed' : 'border-gray-300 bg-white'
                        }`} />
                    </div>
                  </div>
                </div>

                {/* Status info */}
                {!isEditing && !hasBank && (
                  <div className="flex items-center gap-2 text-xs text-violet-700 bg-violet-50 px-3 py-2.5 rounded-lg">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    No payout details added yet. Click Edit to add your bank account.
                  </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  {!isEditing ? (
                    <button type="button" onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-1.5 bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-200 shadow-md hover:shadow-violet-500/40 text-sm cursor-pointer">
                      <Edit2 className="w-4 h-4" />
                      Edit Payout Info
                    </button>
                  ) : (
                    <>
                      <button type="button" onClick={handleCancel} disabled={loading}
                        className="inline-flex items-center gap-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-5 rounded-lg transition-all duration-200 text-sm disabled:opacity-50 cursor-pointer">
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button type="submit" disabled={loading}
                        className="inline-flex items-center gap-1.5 bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-200 shadow-md hover:shadow-violet-500/40 text-sm disabled:opacity-50 cursor-pointer">
                        {loading ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PayoutDetails
