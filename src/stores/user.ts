import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import type { User, LoginData, RegisterData } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  const login = async (credentials: LoginData) => {
    isLoading.value = true
    error.value = null
    try {
      await authApi.login(credentials)
      await fetchCurrentUser()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка авторизации'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (data: RegisterData) => {
    isLoading.value = true
    error.value = null
    try {
      await authApi.register(data)
      await fetchCurrentUser()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка регистрации'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    try {
      await authApi.logout()
      user.value = null
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка выхода'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchCurrentUser = async () => {
    try {
      const response = await authApi.getCurrentUser()
      console.log('Profile response:', response.data)
      user.value = response.data
    } catch (err: any) {
      console.error('Failed to fetch current user:', err)
      user.value = null
    }
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    fetchCurrentUser,
  }
})