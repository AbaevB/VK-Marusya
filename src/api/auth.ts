import api from './index'

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
}

// Функция для преобразования в x-www-form-urlencoded
const toFormData = (data: Record<string, string>) => {
  return Object.entries(data)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
}

export const authApi = {
  // Вход в систему - также x-www-form-urlencoded
  login(data: LoginData) {
    const formData = toFormData({
      email: data.email,
      password: data.password
    })
    return api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
  },

  // Регистрация - x-www-form-urlencoded
  register(data: RegisterData) {
    const formData = toFormData({
      email: data.email,
      password: data.password,
      name: data.firstName,
      surname: data.lastName
    })
    return api.post('/user', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
  },

  // Выход
  logout() {
    return api.get('/auth/logout')
  },

  // Получение информации о текущем пользователе
  getCurrentUser() {
    return api.get<User>('/profile')
  },
}