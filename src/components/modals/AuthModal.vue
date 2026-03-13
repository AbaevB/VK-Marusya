<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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

// Добавляем/убираем класс no-scroll при открытии/закрытии модального окна
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.body.classList.add('no-scroll')
  } else {
    document.body.classList.remove('no-scroll')
  }
})

const userStore = useUserStore()
const isLoginForm = ref(true)
const showSuccess = ref(false)

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
    showSuccess.value = true
  } catch (error) {
    console.error('Ошибка регистрации:', error)
  }
}

const handleSuccessLogin = () => {
  showSuccess.value = false
  isLoginForm.value = true
  registerData.value = { email: '', password: '', firstName: '', lastName: '' }
  errors.value = {}
  emit('success')
  emit('close')
}

const toggleForm = () => {
  isLoginForm.value = !isLoginForm.value
  errors.value = {}
}

const closeModal = () => {
  showSuccess.value = false
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="modal modal--active" id="loginModal">
    <div class="login">
      <!-- Форма входа -->
      <form 
        v-if="isLoginForm && !showSuccess" 
        class="form form--active login-form" 
        id="loginForm" 
        action="#" 
        method="get"
        @submit.prevent="handleLogin" 
      >
        <button class="modal__close" id="loginClose" aria-label="выход" type="button" @click="closeModal">
          <svg class="modal__close-icon" aria-hidden="true" width="13" height="13">
            <use xlink:href="/images/sprite.svg#icon-close-black"></use>
          </svg>
        </button>
        <img class="form__logo" src="/images/logo-light.png" alt="Маруся лого"> 
        <fieldset class="form__fields">
          <label class="form__label" for="email">
            <svg class="form__icon" aria-hidden="true" width="24" height="24">
              <use xlink:href="/images/sprite.svg#icon-email"></use>
            </svg>
            <input class="form__field" id="email" type="email" name="email" placeholder="Электронная почта" v-model="loginData.email">
          </label>
          <label class="form__label" for="password">
            <svg class="form__icon" aria-hidden="true" width="24" height="24">
              <use xlink:href="/images/sprite.svg#icon-key"></use>
            </svg>
            <input class="form__field" id="password" type="password" name="password" placeholder="Пароль" v-model="loginData.password">
          </label>
        </fieldset>
        <div class="form__buttons">
          <button class="btn btn-primary form__submit-btn" type="submit">
            Войти
          </button>
        </div>
        <button class="btn form__toggle-btn" type="button" @click="toggleForm">
          Регистрация
        </button>
      </form>
      
      <!-- Форма регистрации -->
      <form 
        v-if="!isLoginForm && !showSuccess" 
        class="form register-form form--active" 
        id="registerForm" 
        action="#" 
        method="get"
        @submit.prevent="handleRegister"
      >
        <button class="modal__close" id="registerClose" aria-label="выход" type="button" @click="closeModal">
          <svg class="modal__close-icon" aria-hidden="true" width="13" height="13">
            <use xlink:href="/images/sprite.svg#icon-close-black"></use>
          </svg>
        </button>
        <img class="form__logo" src="/images/logo-light.png" alt="Маруся лого">
        <h2 class="form__title">
          Регистрация
        </h2>
        <fieldset class="form__fields">
          <label class="form__label" for="registerEmail">
            <svg class="form__icon" aria-hidden="true" width="24" height="24">
              <use xlink:href="/images/sprite.svg#icon-email"></use>
            </svg>
            <input class="form__field" id="registerEmail" type="email" name="email" placeholder="Электронная почта" v-model="registerData.email">
          </label>

          <label class="form__label" for="registerName">
            <svg class="form__icon" aria-hidden="true" width="24" height="24">
              <use xlink:href="/images/sprite.svg#icon-user-grey"></use>
            </svg>
            <input class="form__field" id="registerName" type="text" name="name" placeholder="Имя" v-model="registerData.firstName">
          </label>

          <label class="form__label" for="registerSurname">
            <svg class="form__icon" aria-hidden="true" width="24" height="24">
              <use xlink:href="/images/sprite.svg#icon-user-grey"></use>
            </svg>
            <input class="form__field" id="registerSurname" type="text" name="surname" placeholder="Фамилия" v-model="registerData.lastName">
          </label>

          <label class="form__label" for="registerPassword">
            <svg class="form__icon" aria-hidden="true" width="24" height="24">
              <use xlink:href="/images/sprite.svg#icon-key"></use>
            </svg>
            <input class="form__field" id="registerPassword" type="password" name="password" placeholder="Пароль" v-model="registerData.password">
          </label>

          <label class="form__label" for="repeatPassword">
            <svg class="form__icon" aria-hidden="true" width="24" height="24">
              <use xlink:href="/images/sprite.svg#icon-key"></use>
            </svg>
            <input class="form__field" id="repeatPassword" type="password" name="password" placeholder="Подтвердите пароль">
          </label>
        </fieldset>
        <div class="form__buttons">
          <button class="btn btn-primary form__submit-btn" type="submit">
            Зарегистрироваться
          </button>
        </div>
        <button class="btn form__toggle-btn" type="button" @click="toggleForm">
          Войти
        </button> 
      </form>

      <!-- Успешная регистрация -->
      <div v-if="showSuccess" class="login__success login__success--active">
        <button class="modal__close" id="successClose" aria-label="выход" type="button" @click="closeModal">
          <svg class="modal__close-icon" aria-hidden="true" width="13" height="13">
            <use xlink:href="/images/sprite.svg#icon-close-black"></use>
          </svg>
        </button>
        <img class="login__success-logo" src="/images/logo-light.png" alt="Маруся лого">
        <h2 class="login__success-title">
          Регистрация завершена
        </h2>
        <p class="login__success-text">
          Используйте вашу электронную почту для входа  
        </p>
        <button class="btn btn-primary login__success-btn" type="button" @click="handleSuccessLogin">
          Войти 
        </button>
      </div>
    </div>
  </div>
</template>

