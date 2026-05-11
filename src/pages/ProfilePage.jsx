import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'
import './ProfilePage.css'

export default function ProfilePage() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    setUser(null)
    navigate('/login')
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-email">{user.email}</p>
        <div className="profile-role">
          {user.role === 'ADMIN' ? '👑 Администратор' : '👤 Пользователь'}
        </div>

        <div className="profile-actions">
          {user.role === 'ADMIN' && (
            <button className="profile-btn admin" onClick={() => navigate('/admin')}>
              Админ-панель
            </button>
          )}
          <button className="profile-btn fridge" onClick={() => navigate('/')}>
            🧊 Мой холодильник
          </button>
          <button className="profile-btn fridge" onClick={() => navigate('/favorites')}>
            ♥ Избранное
          </button>
          <button className="profile-btn logout" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </div>
    </div>
  )
}