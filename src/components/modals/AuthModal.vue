<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import type { LoginData, RegisterData } from '@/api/auth'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const userStore = useUserStore()
const isLoginForm = ref(true)

const loginData = ref<LoginData>({
  email: '',
  password: '',
})

const registerData = ref<RegisterData>({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
})

const errors = ref<Record<string, string>>({})

const validateLoginForm = () => {
  errors.value = {}
  let isValid = true

  if (!loginData.value.email.trim()) {
    errors.value.email = 'Email обязателен'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(loginData.value.email)) {
    errors.value.email = 'Введите корректный email'
    isValid = false
  }

  if (!loginData.value.password) {
    errors.value.password = 'Пароль обязателен'
    isValid = false
  }

  return isValid
}

const validateRegisterForm = () => {
  errors.value = {}
  let isValid = true

  if (!registerData.value.email.trim()) {
    errors.value.email = 'Email обязателен'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(registerData.value.email)) {
    errors.value.email = 'Введите корректный email'
    isValid = false
  }

  if (!registerData.value.password) {
    errors.value.password = 'Пароль обязателен'
    isValid = false
  } else if (registerData.value.password.length < 6) {
    errors.value.password = 'Пароль должен быть не менее 6 символов'
    isValid = false
  }

  if (!registerData.value.firstName.trim()) {
    errors.value.firstName = 'Имя обязательно'
    isValid = false
  }

  if (!registerData.value.lastName.trim()) {
    errors.value.lastName = 'Фамилия обязательна'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateLoginForm()) return

  try {
    await userStore.login(loginData.value)
    emit('success')
    emit('close')
    loginData.value = { email: '', password: '' }
    errors.value = {}
  } catch (error) {
    console.error('Ошибка авторизации:', error)
  }
}

const handleRegister = async () => {
  if (!validateRegisterForm()) return

  try {
    await userStore.register(registerData.value)
    emit('success')
    emit('close')
    registerData.value = { email: '', password: '', firstName: '', lastName: '' }
    errors.value = {}
  } catch (error) {
    console.error('Ошибка регистрации:', error)
  }
}

const toggleForm = () => {
  isLoginForm.value = !isLoginForm.value
  errors.value = {}
}

const handleOverlayClick = (event: MouseEvent) => {
  if ((event.target as HTMLElement).classList.contains('auth-modal__overlay')) {
    emit('close')
  }
}

const title = computed(() => isLoginForm.value ? 'Вход в аккаунт' : 'Регистрация')
const submitButtonText = computed(() => isLoginForm.value ? 'Войти' : 'Зарегистрироваться')
const toggleButtonText = computed(() => isLoginForm.value ? 'Создать аккаунт' : 'Уже есть аккаунт?')
</script>

<template>
  <div 
    v-if="isOpen" 
    class="auth-modal"
    @click="handleOverlayClick"
  >
    <div class="auth-modal__overlay"></div>
    <div class="auth-modal__content">
      <button class="auth-modal__close" @click="$emit('close')">×</button>
      
      <h2 class="auth-modal__title">{{ title }}</h2>
      
      <form 
        v-if="isLoginForm" 
        @submit.prevent="handleLogin" 
        class="auth-modal__form"
      >
        <div class="auth-modal__field">
          <label for="login-email" class="auth-modal__label">Email</label>
          <input
            id="login-email"
            v-model="loginData.email"
            type="email"
            class="auth-modal__input"
            :class="{ 'auth-modal__input--error': errors.email }"
            placeholder="example@mail.com"
          />
          <span v-if="errors.email" class="auth-modal__error">{{ errors.email }}</span>
        </div>
        
        <div class="auth-modal__field">
          <label for="login-password" class="auth-modal__label">Пароль</label>
          <input
            id="login-password"
            v-model="loginData.password"
            type="password"
            class="auth-modal__input"
            :class="{ 'auth-modal__input--error': errors.password }"
            placeholder="Введите пароль"
          />
          <span v-if="errors.password" class="auth-modal__error">{{ errors.password }}</span>
        </div>
        
        <button 
          type="submit" 
          class="auth-modal__submit"
          :disabled="userStore.isLoading"
        >
          {{ userStore.isLoading ? 'Загрузка...' : submitButtonText }}
        </button>
      </form>
      
      <form 
        v-else 
        @submit.prevent="handleRegister" 
        class="auth-modal__form"
      >
        <div class="auth-modal__field">
          <label for="register-firstName" class="auth-modal__label">Имя</label>
          <input
            id="register-firstName"
            v-model="registerData.firstName"
            type="text"
            class="auth-modal__input"
            :class="{ 'auth-modal__input--error': errors.firstName }"
            placeholder="Иван"
          />
          <span v-if="errors.firstName" class="auth-modal__error">{{ errors.firstName }}</span>
        </div>
        
        <div class="auth-modal__field">
          <label for="register-lastName" class="auth-modal__label">Фамилия</label>
          <input
            id="register-lastName"
            v-model="registerData.lastName"
            type="text"
            class="auth-modal__input"
            :class="{ 'auth-modal__input--error': errors.lastName }"
            placeholder="Иванов"
          />
          <span v-if="errors.lastName" class="auth-modal__error">{{ errors.lastName }}</span>
        </div>
        
        <div class="auth-modal__field">
          <label for="register-email" class="auth-modal__label">Email</label>
          <input
            id="register-email"
            v.model="registerData.email"
            type="email"
            class="auth-modal__input"
            :class="{ 'auth-modal__input--error': errors.email }"
            placeholder="example@mail.com"
          />
          <span v-if="errors.email" class="auth-modal__error">{{ errors.email }}</span>
        </div>
        
        <div class="auth-modal__field">
          <label for="register-password" class="auth-modal__label">Пароль</label>
          <input
            id="register-password"
            v-model="registerData.password"
            type="password"
            class="auth-modal__input"
            :class="{ 'auth-modal__input--error': errors.password }"
            placeholder="Не менее 6 символов"
          />
          <span v-if="errors.password" class="auth-modal__error">{{ errors.password }}</span>
        </div>
        
        <button 
          type="submit" 
          class="auth-modal__submit"
          :disabled="userStore.isLoading"
        >
          {{ userStore.isLoading ? 'Загрузка...' : submitButtonText }}
        </button>
      </form>
      
      <div class="auth-modal__footer">
        <button type="button" class="auth-modal__toggle" @click="toggleForm">
          {{ toggleButtonText }}
        </button>
      </div>
      
      <div v-if="userStore.error" class="auth-modal__server-error">
        {{ userStore.error }}
      </div>
    </div>
  </div>
</template>

