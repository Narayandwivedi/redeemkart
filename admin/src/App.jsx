import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AdminLayout from './components/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import GiftCards from './pages/GiftCards'
import UserSelling from './pages/UserSelling'
import Users from './pages/Users'
import Orders from './pages/Orders'
import Login from './pages/Login'

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected admin routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/gift-cards" element={<GiftCards />} />
            <Route path="/user-selling" element={<UserSelling />} />
            <Route path="/users" element={<Users />} />
            <Route path="/orders" element={<Orders />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
