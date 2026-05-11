import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // обязательно для сессий — отправляет куку JSESSIONID
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api