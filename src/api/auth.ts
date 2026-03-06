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

export const authApi = {
  // Вход в систему
  login(data: LoginData) {
    return api.post('/auth/login', data)
  },

  // Регистрация
  register(data: RegisterData) {
    return api.post('/user', data)
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