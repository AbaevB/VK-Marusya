/**
 * Тесты для функций валидации формы авторизации
 */

describe('Валидация формы входа', () => {
  // Функция валидации email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /\S+@\S+\.\S+/
    return emailRegex.test(email)
  }

  // Функция валидации пароля
  const validatePassword = (password: string): { valid: boolean; message?: string } => {
    if (!password) {
      return { valid: false, message: 'Пароль обязателен' }
    }
    if (password.length < 6) {
      return { valid: false, message: 'Пароль должен быть не менее 6 символов' }
    }
    return { valid: true }
  }

  describe('Валидация email', () => {
    it('должен возвращать true для корректного email', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user@mail.ru')).toBe(true)
      expect(validateEmail('admin@domain.co.uk')).toBe(true)
    })

    it('должен возвращать false для некорректного email', () => {
      expect(validateEmail('')).toBe(false)
      expect(validateEmail('notemail')).toBe(false)
      expect(validateEmail('no@domain')).toBe(false)
      expect(validateEmail('@nodomain.com')).toBe(false)
    })
  })

  describe('Валидация пароля', () => {
    it('должен возвращать ошибку для пустого пароля', () => {
      const result = validatePassword('')
      expect(result.valid).toBe(false)
      expect(result.message).toBe('Пароль обязателен')
    })

    it('должен возвращать ошибку для пароля короче 6 символов', () => {
      const result = validatePassword('12345')
      expect(result.valid).toBe(false)
      expect(result.message).toBe('Пароль должен быть не менее 6 символов')
    })

    it('должен возвращать true для корректного пароля', () => {
      expect(validatePassword('123456').valid).toBe(true)
      expect(validatePassword('password123').valid).toBe(true)
      expect(validatePassword('securePass!').valid).toBe(true)
    })
  })
})

describe('Валидация формы регистрации', () => {
  // Функция валидации формы регистрации
  const validateRegisterForm = (data: {
    email: string
    password: string
    firstName: string
    lastName: string
  }): { valid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {}
    let isValid = true

    // Валидация email
    if (!data.email.trim()) {
      errors.email = 'Email обязателен'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Введите корректный email'
      isValid = false
    }

    // Валидация пароля
    if (!data.password) {
      errors.password = 'Пароль обязателен'
      isValid = false
    } else if (data.password.length < 6) {
      errors.password = 'Пароль должен быть не менее 6 символов'
      isValid = false
    }

    // Валидация имени
    if (!data.firstName.trim()) {
      errors.firstName = 'Имя обязательно'
      isValid = false
    }

    // Валидация фамилии
    if (!data.lastName.trim()) {
      errors.lastName = 'Фамилия обязательна'
      isValid = false
    }

    return { valid: isValid, errors }
  }

  it('должен возвращать ошибки для пустой формы', () => {
    const result = validateRegisterForm({
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    })

    expect(result.valid).toBe(false)
    expect(result.errors.email).toBe('Email обязателен')
    expect(result.errors.password).toBe('Пароль обязателен')
    expect(result.errors.firstName).toBe('Имя обязательно')
    expect(result.errors.lastName).toBe('Фамилия обязательна')
  })

  it('должен возвращать ошибку для некорректного email', () => {
    const result = validateRegisterForm({
      email: 'invalid-email',
      password: 'password123',
      firstName: 'Иван',
      lastName: 'Иванов'
    })

    expect(result.valid).toBe(false)
    expect(result.errors.email).toBe('Введите корректный email')
  })

  it('должен возвращать ошибку для короткого пароля', () => {
    const result = validateRegisterForm({
      email: 'test@example.com',
      password: '123',
      firstName: 'Иван',
      lastName: 'Иванов'
    })

    expect(result.valid).toBe(false)
    expect(result.errors.password).toBe('Пароль должен быть не менее 6 символов')
  })

  it('должен возвращать true для корректных данных', () => {
    const result = validateRegisterForm({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Иван',
      lastName: 'Иванов'
    })

    expect(result.valid).toBe(true)
    expect(Object.keys(result.errors).length).toBe(0)
  })

  it('должен возвращать ошибку для пустого имени', () => {
    const result = validateRegisterForm({
      email: 'test@example.com',
      password: 'password123',
      firstName: '',
      lastName: 'Иванов'
    })

    expect(result.valid).toBe(false)
    expect(result.errors.firstName).toBe('Имя обязательно')
  })

  it('должен возвращать ошибку для пустой фамилии', () => {
    const result = validateRegisterForm({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Иван',
      lastName: ''
    })

    expect(result.valid).toBe(false)
    expect(result.errors.lastName).toBe('Фамилия обязательна')
  })
})
