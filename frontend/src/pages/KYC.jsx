import React, { useState, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import {
  ShieldCheck,
  Fingerprint,
  IdCard,
  CreditCard,
  FileText,
  Upload,
  Loader,
  CheckCircle,
  Clock,
  XCircle,
  Image as ImageIcon,
  AlertCircle,
  ChevronDown
} from 'lucide-react'

const DOCUMENT_OPTIONS = [
  { id: 'aadhaar', label: 'Aadhaar Card', description: 'Verify with your 12-digit Aadhaar number', icon: Fingerprint, placeholder: 'Enter 12-digit Aadhaar number', maxLength: 12, inputMode: 'numeric', digitsOnly: true },
  { id: 'pan', label: 'PAN Card', description: 'Verify with your 10-character PAN number', icon: CreditCard, placeholder: 'Enter PAN number (e.g. ABCDE1234F)', maxLength: 10 },
  { id: 'driving_license', label: 'Driving Licence', description: 'Verify with your driving licence number', icon: IdCard, placeholder: 'Enter driving licence number', maxLength: 20 },
  { id: 'passport', label: 'Passport', description: 'Verify with your passport number', icon: FileText, placeholder: 'Enter passport number (e.g. A1234567)', maxLength: 8 }
]

const KYC_STATUS = {
  not_submitted: { label: 'Not Verified', color: 'text-gray-700', bg: 'bg-gray-100', icon: XCircle },
  pending: { label: 'Under Review', color: 'text-amber-700', bg: 'bg-amber-50', icon: Clock },
  verified: { label: 'Verified', color: 'text-green-700', bg: 'bg-green-50', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'text-red-700', bg: 'bg-red-50', icon: XCircle }
}

const KYC = () => {
  const { user, setUser, BACKEND_URL } = useContext(AppContext)
  const [kycData, setKycData] = useState(null)
  const [documentType, setDocumentType] = useState('')
  const [documentNumber, setDocumentNumber] = useState('')
  const [documentImage, setDocumentImage] = useState('')
  const [preview, setPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const currentStatus = user?.kycStatus || kycData?.kycStatus || 'not_submitted'
  const StatusIcon = KYC_STATUS[currentStatus]?.icon || XCircle

  useEffect(() => {
    const fetchKyc = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/kyc`, { credentials: 'include' })
        const result = await response.json()
        if (result.success) {
          setKycData(result.data)
          if (result.data.kycDocumentType) {
            setDocumentType(result.data.kycDocumentType)
            setDocumentNumber('')
          }
        }
      } catch {
        // ignore - status will come from user context
      }
    }
    fetchKyc()
  }, [BACKEND_URL])

  const handleDocumentImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPG, PNG, WebP)')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch(`${BACKEND_URL}/api/upload/image`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      })
      const result = await response.json()

      if (result.success) {
        setDocumentImage(result.data.url)
        setPreview(`${BACKEND_URL}${result.data.url}`)
        toast.success('Document image uploaded')
      } else {
        throw new Error(result.message || 'Upload failed')
      }
    } catch (err) {
      toast.error(err.message || 'Failed to upload document image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!documentType) {
      toast.error('Please select a document type')
      return
    }
    if (!documentNumber.trim()) {
      toast.error('Please enter your document number')
      return
    }
    if (!documentImage) {
      toast.error('Please upload a photo of your document')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`${BACKEND_URL}/api/kyc/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          documentType,
          documentNumber: documentNumber.trim(),
          documentImage
        })
      })
      const result = await response.json()

      if (result.success) {
        setUser(result.user)
        toast.success('KYC submitted successfully! It is now pending verification.')
        setKycData((prev) => ({ ...prev, kycStatus: 'pending', kycDocumentType: documentType }))
        setDocumentNumber('')
      } else {
        throw new Error(result.message || 'Failed to submit KYC')
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit KYC. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const selectedDoc = DOCUMENT_OPTIONS.find((doc) => doc.id === documentType)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-violet-50/20 py-6 sm:py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">KYC Verification</h1>
          <p className="text-sm text-gray-500 mt-1">Verify your identity to unlock full account features</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black px-5 sm:px-6 py-6">
            <div className="flex items-center gap-4">
              <div className="bg-violet-500 p-3 rounded-full shrink-0">
                <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-white">Identity Verification</h2>
                <p className="text-violet-200 text-sm mt-0.5">Choose any one government-issued document</p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {/* Status banner */}
            <div className={`flex items-center gap-2.5 rounded-xl px-4 py-3 mb-6 ${KYC_STATUS[currentStatus]?.bg || 'bg-gray-100'}`}>
              <StatusIcon className={`w-5 h-5 shrink-0 ${KYC_STATUS[currentStatus]?.color || 'text-gray-700'}`} />
              <div>
                <p className={`text-sm font-semibold ${KYC_STATUS[currentStatus]?.color || 'text-gray-700'}`}>
                  {KYC_STATUS[currentStatus]?.label || 'Not Verified'}
                </p>
                {currentStatus === 'pending' && (
                  <p className="text-xs text-gray-500 mt-0.5">Your document is being reviewed. This usually takes up to 24 hours.</p>
                )}
                {currentStatus === 'rejected' && (
                  <p className="text-xs text-red-600 mt-0.5">
                    Reason: {kycData?.kycRejectionReason || user?.kycRejectionReason || 'No reason provided'}. Please resubmit with correct details.
                  </p>
                )}
                {currentStatus === 'verified' && (
                  <p className="text-xs text-green-600 mt-0.5">Your identity has been verified successfully.</p>
                )}
              </div>
            </div>

            {currentStatus === 'verified' ? (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                <CheckCircle className="w-10 h-10 text-green-600 shrink-0" />
                <div>
                  <p className="font-semibold text-green-800">KYC Verified</p>
                  <p className="text-sm text-green-700 mt-0.5">
                    {kycData?.kycDocumentLabel || user?.kycDocumentType} verified on{' '}
                    {kycData?.kycReviewedAt ? new Date(kycData.kycReviewedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'the platform'}.
                  </p>
                </div>
              </div>
            ) : currentStatus === 'pending' ? (
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <Clock className="w-10 h-10 text-amber-600 shrink-0" />
                <div>
                  <p className="font-semibold text-amber-800">KYC Under Review</p>
                  <p className="text-sm text-amber-700 mt-0.5">We'll notify you once your KYC is verified. You cannot resubmit while it's pending.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Document type selection */}
                <div className="mb-6">
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">Document Type</label>
                  <div className="relative">
                    <select
                      value={documentType}
                      onChange={(e) => {
                        setDocumentType(e.target.value)
                        setDocumentNumber('')
                      }}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-white transition-all duration-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 appearance-none pr-10 cursor-pointer"
                    >
                      <option value="">Select a document type</option>
                      {DOCUMENT_OPTIONS.map((doc) => (
                        <option key={doc.id} value={doc.id}>{doc.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {documentType && (
                  <div className="space-y-5">
                    {/* Document number */}
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">
                        {selectedDoc?.label} Number
                      </label>
                      <input
                        type="text"
                        value={documentNumber}
                        onChange={(e) => {
                          let value = e.target.value
                          if (selectedDoc?.digitsOnly) value = value.replace(/\D/g, '')
                          setDocumentNumber(value)
                        }}
                        placeholder={selectedDoc?.placeholder}
                        maxLength={selectedDoc?.maxLength}
                        inputMode={selectedDoc?.inputMode || 'text'}
                        autoComplete="off"
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm transition-all duration-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white"
                      />
                    </div>

                    {/* Document image upload */}
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Photo of Document</label>
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <label className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-200 text-center ${preview ? 'border-green-300 bg-green-50/40' : 'border-gray-300 hover:border-violet-400 hover:bg-violet-50/40'}`}>
                            {preview ? (
                              <img src={preview} alt="Document preview" className="max-h-40 object-contain rounded-lg" />
                            ) : (
                              <>
                                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                                <p className="text-sm font-medium text-gray-600">Click to upload a clear photo of your document</p>
                                <p className="text-xs text-gray-400 mt-1">JPG, PNG or WebP · Max 10MB</p>
                              </>
                            )}
                            <input type="file" accept="image/*" className="hidden" onChange={handleDocumentImage} disabled={uploading} />
                            {uploading && (
                              <span className="flex items-center gap-2 text-xs text-violet-600 mt-2">
                                <Loader className="w-3.5 h-3.5 animate-spin" /> Uploading...
                              </span>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={submitting || uploading}
                        className="inline-flex items-center gap-2 bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-violet-500/40 text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {submitting ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            Submit for Verification
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {!documentType && (
                  <div className="flex items-center gap-2 text-xs text-violet-700 bg-violet-50 px-3 py-2.5 rounded-lg">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Select a document type above to start verification.
                  </div>
                )}
              </form>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          Your KYC details are stored securely and used only for identity verification.
        </p>
      </div>
    </div>
  )
}

export default KYC
