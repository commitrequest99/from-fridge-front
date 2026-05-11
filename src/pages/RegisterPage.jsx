import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../api/auth'
import './AuthPage.css'

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', name: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Пароли не совпадают')
      return
    }
    try {
      await register(form)
      navigate('/login')
    } catch (err) {
      const data = err.response?.data
      if (data && typeof data === 'object') {
        const messages = Object.values(data).join(', ')
        setError(messages)
      } else if (typeof data === 'string') {
        setError(data)
      } else {
        setError('Ошибка регистрации')
      }
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">🍎 FrigeFood</div>
        <h2>Регистрация</h2>
        <form onSubmit={handleSubmit}>
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="name" placeholder="Имя" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Пароль" onChange={handleChange} required />
          <input name="confirmPassword" type="password" placeholder="Подтвердите пароль" onChange={handleChange} required />
          {error && <div className="auth-error">{error}</div>}
          <button type="submit">Зарегистрироваться</button>
        </form>
        <div className="auth-link">
          Уже есть аккаунт?{' '}
          <span onClick={() => navigate('/login')}>Войти</span>
        </div>
      </div>
    </div>
  )
}