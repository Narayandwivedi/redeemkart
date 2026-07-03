import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { 
  Gift, Trash2, Plus, Search, ShieldCheck, User, Copy, RefreshCcw, 
  Settings, Save, X, ToggleLeft, ToggleRight, ChevronDown, ChevronRight,
  Key, Calendar, Store
} from 'lucide-react'

const brandsList = ['Google Play', 'Amazon', 'Flipkart', 'Steam', 'Myntra', 'BigBasket']
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

const GiftCards = () => {
  const [activeTab, setActiveTab] = useState('manage')
  const [products, setProducts] = useState([])
  const [userListings, setUserListings] = useState([])
  const [loading, setLoading] = useState(true)

  // Manage tab state
  const [selectedBrand, setSelectedBrand] = useState('Google Play')
  const [editingVariant, setEditingVariant] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [expandedVariant, setExpandedVariant] = useState(null) // which variant's codes are open
  const [variantCodes, setVariantCodes] = useState({}) // { [productId]: [...codes] }
  const [codeLoadingFor, setCodeLoadingFor] = useState(null)

  // Add new variant form
  const [showAddVariant, setShowAddVariant] = useState(false)
  const [newVariantForm, setNewVariantForm] = useState({ originalPrice: '', price: '', stockQuantity: '', maxAddCartItem: '' })

  const [showInactive, setShowInactive] = useState(true) // show inactive variants by default in admin
  const [addCodeForm, setAddCodeForm] = useState({})
  const [showAddCodeModal, setShowAddCodeModal] = useState(null) // productId of variant to add code to

  const [search, setSearch] = useState('')

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [listingsRes, productsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/admin/gift-cards`, { withCredentials: true }),
        // Fetch ALL products (including inactive) for admin panel
        axios.get(`${BACKEND_URL}/api/products?limit=500`)
      ])
      if (listingsRes.data.success) {
        setUserListings(listingsRes.data.data.filter(l => l.listedBy === 'user' || !l.listedBy))
      }
      if (productsRes.data.success) setProducts(productsRes.data.data.filter(p => p.category === 'gift-cards'))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const fetchCodesForVariant = async (productId) => {
    try {
      setCodeLoadingFor(productId)
      const res = await axios.get(`${BACKEND_URL}/api/admin/gift-cards/product/${productId}`, { withCredentials: true })
      if (res.data.success) {
        setVariantCodes(prev => ({ ...prev, [productId]: res.data.data }))
      }
    } catch (err) {
      toast.error('Failed to load codes')
    } finally {
      setCodeLoadingFor(null)
    }
  }

  const handleToggleExpand = (productId) => {
    if (expandedVariant === productId) {
      setExpandedVariant(null)
    } else {
      setExpandedVariant(productId)
      if (!variantCodes[productId]) {
        fetchCodesForVariant(productId)
      }
    }
  }

  const handleOpenAddCodeModal = (productId) => {
    setShowAddCodeModal(productId)
    setAddCodeForm(prev => {
      if (!prev[productId]?.expiry) {
        const nextYear = new Date()
        nextYear.setFullYear(nextYear.getFullYear() + 1)
        return {
          ...prev,
          [productId]: { code: '', pin: '', expiry: nextYear.toISOString().split('T')[0] }
        }
      }
      return prev
    })
  }

  const handleAddCode = async () => {
    const productId = showAddCodeModal
    const product = products.find(p => p._id === productId)
    const form = addCodeForm[productId]
    if (!form?.code || !form?.expiry) return toast.error('Code and expiry are required')

    try {
      const payload = {
        brand: product.brand,
        balance: product.originalPrice || product.price,
        code: form.code,
        pin: form.pin || '',
        expiry: form.expiry,
        productId: product._id
      }
      const res = await axios.post(`${BACKEND_URL}/api/admin/gift-cards`, payload, { withCredentials: true })
      if (res.data.success) {
        toast.success('Code added!')
        
        const nextYear = new Date()
        nextYear.setFullYear(nextYear.getFullYear() + 1)
        setAddCodeForm(prev => ({ ...prev, [productId]: { code: '', pin: '', expiry: nextYear.toISOString().split('T')[0] } }))
        
        setShowAddCodeModal(null)
        // Refresh codes for this variant
        fetchCodesForVariant(productId)
        fetchData()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add code')
    }
  }

  const handleDeleteCode = async (listingId, productId) => {
    if (!window.confirm('Delete this code? Active codes will decrement stock.')) return
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/gift-cards/${listingId}`, { withCredentials: true })
      toast.success('Code deleted & stock synced')
      fetchCodesForVariant(productId)
      fetchData()
    } catch (err) {
      toast.error('Failed to delete code')
    }
  }

  // ---- Variant management ----
  const handleEditClick = (p) => {
    setEditingVariant(p._id)
    setEditForm({ originalPrice: p.originalPrice || '', price: p.price, stockQuantity: p.stockQuantity, maxAddCartItem: p.maxAddCartItem ?? '', isActive: p.isActive })
  }

  const handleSaveVariant = async (id) => {
    try {
      const res = await axios.put(`${BACKEND_URL}/api/products/edit/${id}`, editForm, { withCredentials: true })
      if (res.data.success) {
        toast.success('Variant updated!')
        setEditingVariant(null)
        fetchData()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update')
    }
  }

  const handleToggleActive = async (p) => {
    try {
      await axios.put(`${BACKEND_URL}/api/products/edit/${p._id}`, { isActive: !p.isActive }, { withCredentials: true })
      toast.success(p.isActive ? 'Marked inactive / out of stock' : 'Marked active')
      fetchData()
    } catch (err) {
      toast.error('Failed to toggle status')
    }
  }

  const handleAddVariant = async () => {
    if (!newVariantForm.originalPrice || !newVariantForm.price) return toast.error('Prices are required')
    const payload = {
      seoTitle: `${selectedBrand} Code - ₹${newVariantForm.originalPrice} Voucher`,
      description: `₹${newVariantForm.originalPrice} ${selectedBrand} Gift Card at just ₹${newVariantForm.price}.`,
      category: 'gift-cards',
      subCategory: 'digital-vouchers',
      brand: selectedBrand,
      originalPrice: Number(newVariantForm.originalPrice),
      price: Number(newVariantForm.price),
      stockQuantity: Number(newVariantForm.stockQuantity || 0),
      maxAddCartItem: newVariantForm.maxAddCartItem ? Number(newVariantForm.maxAddCartItem) : 4,
      isActive: true,
      images: [`/products/${selectedBrand.toLowerCase().replace(' ', '%20')}.avif`]
    }
    try {
      const res = await axios.post(`${BACKEND_URL}/api/products/add`, payload, { withCredentials: true })
      if (res.data.success) {
        toast.success('Variant created!')
        setShowAddVariant(false)
        setNewVariantForm({ originalPrice: '', price: '', stockQuantity: '' })
        fetchData()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create variant')
    }
  }

  // ---- User listings ----
  const handleDeleteUserListing = async (id) => {
    if (!window.confirm('Delete this user listing?')) return
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/gift-cards/${id}`, { withCredentials: true })
      toast.info('Listing deleted')
      fetchData()
    } catch (err) {
      toast.error('Failed to delete')
    }
  }

  const handleMakeActive = async (id) => {
    if (!window.confirm('Change status to active?')) return
    try {
      await axios.patch(`${BACKEND_URL}/api/admin/gift-cards/${id}/status`, { status: 'active' }, { withCredentials: true })
      toast.success('Status changed to active')
      fetchData()
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  // ---- Derived data ----
  const brandProducts = products
    .filter(p => p.brand === selectedBrand)
    .filter(p => showInactive ? true : p.isActive)
    .sort((a, b) => (a.originalPrice || a.price) - (b.originalPrice || b.price))
  const filteredUserListings = userListings.filter(c =>
    (c.brand || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.code || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.user?.fullName || '').toLowerCase().includes(search.toLowerCase())
  )

  // ---- Render ----
  const renderTabs = () => (
    <div className="flex space-x-1 bg-gray-100/50 p-1 rounded-xl mb-6 border border-gray-200 w-fit">
      {[
        { key: 'manage', label: 'Manage Catalog & Codes', icon: Store, color: 'indigo' },
        { key: 'user_listings', label: `User Selling List (${userListings.length})`, icon: User, color: 'emerald' },
      ].map(tab => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`py-2 px-5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === tab.key ? `bg-white text-${tab.color}-600 shadow-sm` : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <tab.icon className="w-4 h-4" /> {tab.label}
        </button>
      ))}
    </div>
  )

  const renderManage = () => (
    <div className="space-y-5">
      {/* Brand Pills */}
      <div className="flex flex-wrap gap-2">
        {brandsList.map(brand => (
          <button
            key={brand}
            onClick={() => setSelectedBrand(brand)}
            className={`px-5 py-2 rounded-full text-sm font-bold border transition-colors ${selectedBrand === brand ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          >
            {brand}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center gap-3">
          <h2 className="text-lg font-bold text-gray-800">{selectedBrand} — Variants & Codes</h2>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setShowInactive(prev => !prev)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                showInactive ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {showInactive ? 'Showing All (incl. Inactive)' : 'Show Inactive'}
            </button>
            <button
              onClick={() => setShowAddVariant(!showAddVariant)}
              className="flex items-center gap-1.5 text-sm font-semibold bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-200"
            >
              {showAddVariant ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showAddVariant ? 'Cancel' : 'Add New Variant'}
            </button>
          </div>
        </div>

        {/* Add variant panel */}
        {showAddVariant && (
          <div className="p-4 bg-indigo-50/50 border-b grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Original Price (₹) *</label>
              <input type="number" value={newVariantForm.originalPrice} onChange={e => setNewVariantForm({...newVariantForm, originalPrice: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 100" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Selling Price (₹) *</label>
              <input type="number" value={newVariantForm.price} onChange={e => setNewVariantForm({...newVariantForm, price: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 90" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Initial Stock Qty</label>
              <input type="number" value={newVariantForm.stockQuantity} onChange={e => setNewVariantForm({...newVariantForm, stockQuantity: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 100" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Max Cart Qty</label>
              <input type="number" value={newVariantForm.maxAddCartItem} onChange={e => setNewVariantForm({...newVariantForm, maxAddCartItem: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 4" />
            </div>
            <button onClick={handleAddVariant} className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700">Create Variant</button>
          </div>
        )}

        {/* Variants list */}
        {loading ? (
          <div className="py-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" /></div>
        ) : brandProducts.length === 0 ? (
          <div className="py-12 text-center text-gray-400">No variants for {selectedBrand}. Add one above.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {brandProducts.map(p => {
              const isEditing = editingVariant === p._id
              const isExpanded = expandedVariant === p._id
              const codes = variantCodes[p._id] || []
              const activeCodes = codes.filter(c => c.status === 'active')
              const soldCodes = codes.filter(c => c.status === 'sold')
              const codeForm = addCodeForm[p._id] || {}

              return (
                <div key={p._id}>
                  {/* Variant row */}
                  <div className="px-4 py-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-4 hover:bg-gray-50 transition-colors">
                    
                    {/* Top Section for Mobile: Expand + Name */}
                    <div className="flex items-start md:items-center gap-3 w-full md:w-auto flex-1">
                      {/* Expand toggle */}
                      <button onClick={() => handleToggleExpand(p._id)} className="text-gray-400 hover:text-indigo-500 mt-1 md:mt-0 flex-shrink-0">
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </button>

                      {/* Denomination */}
                      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-bold ${p.isActive ? 'text-gray-800' : 'text-gray-400'}`}>{selectedBrand} — ₹{p.originalPrice || p.price}</span>
                          {!p.isActive && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-600 px-2 py-0.5 rounded-full border border-red-200">Inactive</span>
                          )}
                          <button onClick={() => !isEditing && handleToggleActive(p)} title={p.isActive ? 'Active — click to deactivate' : 'Inactive — click to activate'} className="ml-1 mt-0.5 disabled:opacity-50" disabled={isEditing}>
                            {p.isActive ? <ToggleRight className="w-6 h-6 text-emerald-500" /> : <ToggleLeft className="w-6 h-6 text-gray-300" />}
                          </button>
                        </div>
                        <span className="text-xs text-gray-400">{p.stockQuantity} in stock</span>
                      </div>
                    </div>

                    {/* Bottom Section for Mobile: Prices + Actions */}
                    <div className="flex flex-wrap items-center justify-between w-full md:w-auto gap-4 pl-8 md:pl-0">
                      
                      {/* Prices */}
                      {isEditing ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-0.5">Original ₹</label>
                            <input type="number" value={editForm.originalPrice} onChange={e => setEditForm({...editForm, originalPrice: e.target.value})} className="w-16 md:w-20 px-2 py-1 text-sm border border-gray-300 rounded" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-0.5">Sell ₹</label>
                            <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} className="w-16 md:w-20 px-2 py-1 text-sm border border-gray-300 rounded" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-0.5">Stock</label>
                            <input type="number" value={editForm.stockQuantity} onChange={e => setEditForm({...editForm, stockQuantity: e.target.value})} className="w-16 md:w-20 px-2 py-1 text-sm border border-gray-300 rounded" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-0.5">Max Qty</label>
                            <input type="number" value={editForm.maxAddCartItem} onChange={e => setEditForm({...editForm, maxAddCartItem: e.target.value})} className="w-16 md:w-20 px-2 py-1 text-sm border border-gray-300 rounded" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-gray-400 line-through">₹{p.originalPrice}</span>
                          <span className="text-emerald-600 font-bold text-base">₹{p.price}</span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 md:gap-4 ml-auto">


                        {/* Edit / Save / Cancel */}
                        <div className="flex items-center gap-1 bg-white border border-gray-100 shadow-sm rounded-lg p-0.5">
                          {!isEditing && (
                            <button 
                              onClick={() => handleOpenAddCodeModal(p._id)} 
                              className="px-2 py-1 text-indigo-600 hover:bg-indigo-50 rounded flex items-center gap-1 text-xs font-bold"
                              title="Add Code to Variant"
                            >
                              <Plus className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Add Code</span>
                            </button>
                          )}
                          
                          {isEditing ? (
                            <>
                              <button onClick={() => setEditingVariant(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded"><X className="w-4 h-4" /></button>
                              <button onClick={() => handleSaveVariant(p._id)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"><Save className="w-4 h-4" /></button>
                            </>
                          ) : (
                            <button onClick={() => handleEditClick(p)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"><Settings className="w-4 h-4" /></button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded: Codes panel */}
                  {isExpanded && (
                    <div className="border-t border-dashed border-gray-200 bg-slate-50 px-8 py-5 space-y-4">
                      {/* Codes Table */}
                      {codeLoadingFor === p._id ? (
                        <div className="text-center py-4 text-gray-400 text-sm">Loading codes…</div>
                      ) : (
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex gap-4 text-xs font-semibold">
                              <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{activeCodes.length} Active</span>
                              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{soldCodes.length} Sold</span>
                            </div>
                            <button
                              onClick={() => handleOpenAddCodeModal(p._id)}
                              className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-200"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add Code
                            </button>
                          </div>
                          
                          {codes.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg bg-white">
                              No codes have been added to this variant yet.
                            </div>
                          ) : (
                            <div className="overflow-x-auto pb-2">
                              <table className="w-full text-sm border-collapse min-w-[500px]">
                                <thead>
                                  <tr className="text-left text-xs uppercase tracking-wider text-gray-400">
                                    <th className="pb-2 pr-4">Code</th>
                                    <th className="pb-2 pr-4">PIN</th>
                                    <th className="pb-2 pr-4">Expiry</th>
                                    <th className="pb-2 pr-4">Status</th>
                                    <th className="pb-2 pr-4">Sold To</th>
                                    <th className="pb-2 text-right">Action</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {codes.map(c => (
                                    <tr key={c._id} className="hover:bg-white transition-colors">
                                      <td className="py-2 pr-4 font-mono text-xs">
                                        <div className="flex items-center gap-2">
                                          <span className="bg-gray-100 px-2 py-0.5 rounded">{c.code}</span>
                                          <button onClick={() => { navigator.clipboard.writeText(c.code); toast.success('Copied!') }} className="text-gray-400 hover:text-gray-700"><Copy className="w-3 h-3" /></button>
                                        </div>
                                      </td>
                                      <td className="py-2 pr-4 font-mono text-xs text-gray-500">{c.pin || '—'}</td>
                                      <td className="py-2 pr-4 text-xs text-gray-500">{new Date(c.expiry).toLocaleDateString('en-IN')}</td>
                                      <td className="py-2 pr-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                          c.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                                          c.status === 'sold' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                                        }`}>{c.status}</span>
                                      </td>
                                      <td className="py-2 pr-4 text-xs text-gray-500">
                                        {c.soldTo ? <span>{c.soldTo.email}</span> : '—'}
                                      </td>
                                      <td className="py-2 text-right">
                                        <button onClick={() => handleDeleteCode(c._id, p._id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded">
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )

  const renderUserListings = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b flex justify-between items-center gap-4">
        <h2 className="text-lg font-bold text-gray-800">User-Submitted Selling List</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search codes, brands..." className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-white border-b text-gray-500 font-semibold uppercase text-xs tracking-wider">
              <th className="px-6 py-4">Brand / Value</th>
              <th className="px-6 py-4">Code / PIN</th>
              <th className="px-6 py-4">Seller</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUserListings.length === 0 ? (
              <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                <Gift className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                No user-submitted listings found.
              </td></tr>
            ) : filteredUserListings.map(card => (
              <tr key={card._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="font-bold text-gray-800 block">{card.brand}</span>
                  <span className="text-emerald-600 font-semibold text-xs">₹{card.balance}</span>
                </td>
                <td className="px-6 py-4 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-100 px-2 py-1 rounded">{card.code}</span>
                    <button onClick={() => { navigator.clipboard.writeText(card.code); toast.success('Copied!') }}><Copy className="w-3 h-3 text-gray-400" /></button>
                  </div>
                  {card.pin && <div className="mt-1 text-gray-400">PIN: {card.pin}</div>}
                </td>
                <td className="px-6 py-4">
                  <span className="block font-medium text-gray-800">{card.user?.fullName || 'Unknown'}</span>
                  <span className="block text-xs text-gray-400">{card.user?.email}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase ${
                    card.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                    card.status === 'sold' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                  }`}>{card.status}</span>
                  {card.status === 'sold' && card.soldTo && (
                    <span className="block text-[10px] text-gray-500 mt-1">Buyer: {card.soldTo.email}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-xs text-gray-500">{new Date(card.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {card.status === 'sold' && (
                      <button onClick={() => handleMakeActive(card._id)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded" title="Mark Active">
                        <RefreshCcw className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => handleDeleteUserListing(card._id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gift Cards Dashboard</h1>
      </div>
      {renderTabs()}
      {activeTab === 'manage' && renderManage()}
      {activeTab === 'user_listings' && renderUserListings()}

      {/* Add Code Modal */}
      {showAddCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-600" />
                Add Redeem Code
              </h3>
              <button onClick={() => setShowAddCodeModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Code *</label>
                <input
                  type="text"
                  value={addCodeForm[showAddCodeModal]?.code || ''}
                  onChange={e => setAddCodeForm(prev => ({ ...prev, [showAddCodeModal]: { ...prev[showAddCodeModal], code: e.target.value } }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">PIN (optional)</label>
                <input
                  type="text"
                  value={addCodeForm[showAddCodeModal]?.pin || ''}
                  onChange={e => setAddCodeForm(prev => ({ ...prev, [showAddCodeModal]: { ...prev[showAddCodeModal], pin: e.target.value } }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
                  placeholder="1234"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Expiry *
                </label>
                <input
                  type="date"
                  value={addCodeForm[showAddCodeModal]?.expiry || ''}
                  onChange={e => setAddCodeForm(prev => ({ ...prev, [showAddCodeModal]: { ...prev[showAddCodeModal], expiry: e.target.value } }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowAddCodeModal(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCode}
                className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors"
              >
                Save Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GiftCards
