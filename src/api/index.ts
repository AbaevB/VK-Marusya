import axios from 'axios'

// Базовый URL API
const API_BASE_URL = 'https://cinemaguide.skillbox.cc'

// Создание экземпляра axios с настройками
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Включаем отправку cookies для сессий
  headers: {
    'Content-Type': 'application/json',
  },
})

// Интерцептор для добавления токена авторизации (если понадобится)
api.interceptors.request.use(
  (config) => {
    // Можно добавить логику для добавления токена
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    
    switch (status) {
      case 401:
        // Обработка неавторизованного доступа
        console.error('Unauthorized access')
        // Можно перенаправить на страницу логина
        break
      case 404:
        console.error('API endpoint not found:', error.config?.url)
        // Можно показать пользовательское сообщение
        break
      case 500:
        console.error('Server error')
        break
      default:
        console.error('API error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default api