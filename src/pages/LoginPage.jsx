import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { getProfile } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import './AuthPage.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      const res = await getProfile()
      setUser(res.data)
      navigate('/')
    } catch {
      setError('Неверный email или пароль')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">🍎 FrigeFood</div>
        <h2>Вход</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="auth-error">{error}</div>}
          <button type="submit">Войти</button>
        </form>
        <div className="auth-link">
          Нет аккаунта?{' '}
          <span onClick={() => navigate('/register')}>Зарегистрироваться</span>
        </div>
      </div>
    </div>
  )
}