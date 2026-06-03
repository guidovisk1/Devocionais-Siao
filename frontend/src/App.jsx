import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Home from './pages/Home'
import DevotionalDetail from './pages/DevotionalDetail'
import Login from './pages/Login'
import Dashboard from './pages/admin/Dashboard'
import DevotionalForm from './pages/admin/DevotionalForm'
import ManageUsers from './pages/admin/ManageUsers'
import ManageComments from './pages/admin/ManageComments'
import ManageCategories from './pages/admin/ManageCategories'
import NotFound from './pages/NotFound'

function PrivateRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/admin" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/devocional/:id" element={<DevotionalDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/admin/devocionais/nova" element={<PrivateRoute><DevotionalForm /></PrivateRoute>} />
          <Route path="/admin/devocionais/:id/editar" element={<PrivateRoute><DevotionalForm /></PrivateRoute>} />
          <Route path="/admin/usuarios" element={<PrivateRoute adminOnly><ManageUsers /></PrivateRoute>} />
          <Route path="/admin/comentarios" element={<PrivateRoute adminOnly><ManageComments /></PrivateRoute>} />
          <Route path="/admin/categorias" element={<PrivateRoute adminOnly><ManageCategories /></PrivateRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
