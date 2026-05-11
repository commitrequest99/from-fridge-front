import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logout } from '../api/auth'
import './Navbar.css'

export default function Navbar() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    setUser(null)
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')}>
        🍎 FrigeFood
      </div>
      <div className="navbar-right">
        {user ? (
          <>
            <span className="navbar-name" onClick={() => navigate('/profile')} style={{cursor:'pointer'}}>
              {user.name}
            </span>
            {user.role === 'ADMIN' && (
              <button className="navbar-btn" onClick={() => navigate('/admin')}>
                Админ-панель
              </button>
            )}
            <button className="navbar-btn logout" onClick={handleLogout}>
              Выйти
            </button>
          </>
        ) : (
          <>
            <button className="navbar-btn" onClick={() => navigate('/login')}>Войти</button>
            <button className="navbar-btn" onClick={() => navigate('/register')}>Регистрация</button>
          </>
        )}
      </div>
    </nav>
  )
}