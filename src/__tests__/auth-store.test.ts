/**
 * Тесты для функций авторизации
 */

// Мок типов
interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

interface User {
  id: number
  email: string
  firstName: string
  lastName: string
}

// Мок пользователя
const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  firstName: 'Иван',
  lastName: 'Иванов'
}

describe('Функции авторизации', () => {
  // Симуляция хранилища пользователя
  let currentUser: User | null = null
  let isAuthenticated = false

  // Функция входа
  const login = async (data: LoginData): Promise<User> => {
    // Симуляция API запроса
    if (data.email === 'test@example.com' && data.password === 'password123') {
      currentUser = mockUser
      isAuthenticated = true
      return mockUser
    }
    throw new Error('Неверный email или пароль')
  }

  // Функция регистрации
  const register = async (data: RegisterData): Promise<{ success: boolean }> => {
    // Симуляция API запроса
    if (data.email && data.password && data.firstName && data.lastName) {
      return { success: true }
    }
    throw new Error('Ошибка регистрации')
  }

  // Функция выхода
  const logout = async (): Promise<void> => {
    currentUser = null
    isAuthenticated = false
  }

  // Функция получения текущего пользователя
  const fetchCurrentUser = async (): Promise<User | null> => {
    if (isAuthenticated) {
      return currentUser
    }
    return null
  }

  beforeEach(() => {
    currentUser = null
    isAuthenticated = false
  })

  describe('Вход пользователя', () => {
    it('должен успешно войти с корректными данными', async () => {
      const user = await login({ email: 'test@example.com', password: 'password123' })
      expect(user).toEqual(mockUser)
      expect(isAuthenticated).toBe(true)
    })

    it('должен выбросить ошибку с неверным паролем', async () => {
      await expect(login({ email: 'test@example.com', password: 'wrong' }))
        .rejects.toThrow('Неверный email или пароль')
    })

    it('должен выбросить ошибку с неверным email', async () => {
      await expect(login({ email: 'wrong@example.com', password: 'password123' }))
        .rejects.toThrow('Неверный email или пароль')
    })
  })

  describe('Регистрация пользователя', () => {
    it('должен успешно зарегистрировать с корректными данными', async () => {
      const result = await register({
        email: 'new@example.com',
        password: 'password123',
        firstName: 'Пётр',
        lastName: 'Петров'
      })
      expect(result.success).toBe(true)
    })

    it('должен выбросить ошибку при отсутствии обязательных полей', async () => {
      await expect(register({
        email: '',
        password: 'password123',
        firstName: 'Пётр',
        lastName: 'Петров'
      })).rejects.toThrow('Ошибка регистрации')
    })
  })

  describe('Выход пользователя', () => {
    it('должен успешно выйти и очистить данные пользователя', async () => {
      await login({ email: 'test@example.com', password: 'password123' })
      expect(isAuthenticated).toBe(true)

      await logout()
      expect(isAuthenticated).toBe(false)
      expect(currentUser).toBe(null)
    })
  })

  describe('Получение текущего пользователя', () => {
    it('должен возвращать пользователя если авторизован', async () => {
      await login({ email: 'test@example.com', password: 'password123' })
      const user = await fetchCurrentUser()
      expect(user).toEqual(mockUser)
    })

    it('должен возвращать null если не авторизован', async () => {
      const user = await fetchCurrentUser()
      expect(user).toBe(null)
    })
  })
})

describe('Валидация данных пользователя', () => {
  // Функция валидации данных пользователя
  const validateUserData = (data: Partial<User>): { valid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      errors.push('Некорректный email')
    }

    if (!data.firstName || data.firstName.trim().length === 0) {
      errors.push('Имя обязательно')
    }

    if (!data.lastName || data.lastName.trim().length === 0) {
      errors.push('Фамилия обязательна')
    }

    return { valid: errors.length === 0, errors }
  }

  it('должен возвращать ошибки для пустых данных', () => {
    const result = validateUserData({})
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Некорректный email')
    expect(result.errors).toContain('Имя обязательно')
    expect(result.errors).toContain('Фамилия обязательна')
  })

  it('должен возвращать true для корректных данных', () => {
    const result = validateUserData({
      email: 'test@example.com',
      firstName: 'Иван',
      lastName: 'Иванов'
    })
    expect(result.valid).toBe(true)
  })

  it('должен возвращать ошибку для некорректного email', () => {
    const result = validateUserData({
      email: 'invalid',
      firstName: 'Иван',
      lastName: 'Иванов'
    })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Некорректный email')
  })
})

describe('Форматирование данных пользователя', () => {
  // Функция получения инициалов
  const getInitials = (firstName: string, lastName: string): string => {
    if (!firstName || !lastName) return '??'
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  // Функция полного имени
  const getFullName = (firstName: string, lastName: string): string => {
    return `${firstName} ${lastName}`.trim()
  }

  describe('Получение инициалов', () => {
    it('должен возвращать инициалы для корректных данных', () => {
      expect(getInitials('Иван', 'Иванов')).toBe('ИИ')
      expect(getInitials('Пётр', 'Петров')).toBe('ПП')
    })

    it('должен возвращать "??" для пустых данных', () => {
      expect(getInitials('', '')).toBe('??')
      expect(getInitials('Иван', '')).toBe('??')
      expect(getInitials('', 'Иванов')).toBe('??')
    })
  })

  describe('Получение полного имени', () => {
    it('должен возвращать полное имя', () => {
      expect(getFullName('Иван', 'Иванов')).toBe('Иван Иванов')
    })

    it('должен обрабатывать пустые значения', () => {
      expect(getFullName('Иван', '')).toBe('Иван')
      expect(getFullName('', 'Иванов')).toBe('Иванов')
      expect(getFullName('', '')).toBe('')
    })
  })
})
