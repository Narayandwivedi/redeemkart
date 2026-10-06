import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { MessageSquare, Search, Download, X, ChevronLeft, ChevronRight } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

function formatExactDateTime(date) {
  if (!date) return '-'
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  let hours = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12
  return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`
}

const AIChats = () => {
  const [conversations, setConversations] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [openChat, setOpenChat] = useState(null)
  const [exporting, setExporting] = useState(false)
  const limit = 20

  const fetchConversations = async (pageNum = page, query = search) => {
    try {
      const params = { page: pageNum, limit }
      if (query.trim()) params.search = query.trim()
      const res = await axios.get(`${BACKEND_URL}/api/chatbot/conversations`, { params, withCredentials: true })
      if (res.data.success) {
        setConversations(res.data.data.conversations)
        setPage(res.data.data.pagination.currentPage)
        setTotalPages(res.data.data.pagination.totalPages)
        setTotal(res.data.data.pagination.totalConversations)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load AI chats')
    } finally {
      setLoading(false)
    }
  }

  // Search waits for a pause in typing before asking the server
  useEffect(() => {
    const timer = setTimeout(() => fetchConversations(1, search), 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const viewConversation = async (id) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/chatbot/conversations/${id}`, { withCredentials: true })
      if (res.data.success) setOpenChat(res.data.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load conversation')
    }
  }

  const exportAll = async () => {
    setExporting(true)
    try {
      const res = await axios.get(`${BACKEND_URL}/api/chatbot/conversations/export`, { withCredentials: true, responseType: 'blob' })
      const url = URL.createObjectURL(res.data)
      const link = document.createElement('a')
      link.href = url
      link.download = `chatbot-conversations-${new Date().toISOString().slice(0, 10)}.jsonl`
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Export failed')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">AI Chats</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">{total} conversation{total !== 1 ? 's' : ''}</span>
          <button
            onClick={exportAll}
            disabled={exporting || total === 0}
            title="Download every conversation as a JSON Lines file"
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            {exporting ? 'Exporting...' : 'Export all'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-100 px-4 py-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by user name or email..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-semibold text-gray-600">User</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Messages</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Started</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Last message</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400">Loading...</td>
                </tr>
              ) : conversations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No AI chats saved yet</p>
                  </td>
                </tr>
              ) : (
                conversations.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{c.userName || '-'}</p>
                      <p className="text-xs text-gray-500">{c.userEmail || '-'}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{c.messageCount}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{formatExactDateTime(c.createdAt)}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{formatExactDateTime(c.lastMessageAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => viewConversation(c._id)}
                        className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded font-semibold text-xs border border-blue-200"
                      >
                        View chat
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchConversations(page - 1)}
                disabled={page <= 1}
                className="p-1.5 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => fetchConversations(page + 1)}
                disabled={page >= totalPages}
                className="p-1.5 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {openChat && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4" onClick={() => setOpenChat(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <p className="font-semibold text-gray-900">{openChat.userName || '-'}</p>
                <p className="text-xs text-gray-500">{openChat.userEmail} · started {formatExactDateTime(openChat.createdAt)}</p>
              </div>
              <button onClick={() => setOpenChat(null)} className="text-gray-400 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gray-50">
              {openChat.messages.map((m, index) => (
                <div key={index} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                    <p className={`text-[11px] font-semibold mb-0.5 ${m.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                      {m.role === 'user' ? openChat.userName || 'User' : 'AI assistant'} · {formatExactDateTime(m.createdAt)}
                    </p>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIChats
