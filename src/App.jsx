import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import FridgePage from './pages/FridgePage'
import RecipesPage from './pages/RecipesPage'
import AdminPage from './pages/AdminPage'
import ProfilePage from './pages/ProfilePage'
import FavoritesPage from './pages/FavoritesPage'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function AdminRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (user.role !== 'ADMIN') return <Navigate to="/" />
  return children
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
        <Route path="/" element={<PrivateRoute><FridgePage /></PrivateRoute>} />
        <Route path="/recipes" element={<PrivateRoute><RecipesPage /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}