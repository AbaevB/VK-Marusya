/**
 * Тесты для функций работы с жанрами
 */

describe('Функции работы с жанрами', () => {
  // Симуляция списка жанров с сервера
  const mockGenresFromApi = [
    'Action',
    'Comedy',
    'Drama',
    'Horror',
    'Sci-Fi',
    'Thriller',
    'Romance',
    'Animation',
    'Adventure',
    'Fantasy'
  ]

  // Функция преобразования жанров в объекты с изображениями
  const mapGenresWithImages = (genres: string[]): Array<{ id: number; name: string; image: string }> => {
    return genres.map((name, index) => ({
      id: index + 1,
      name,
      image: `/images/genres/genre-${index + 1}.png`
    }))
  }

  // Функция поиска жанра по ID
  const findGenreById = (genres: Array<{ id: number; name: string }>, id: number) => {
    return genres.find(genre => genre.id === id)
  }

  // Функция поиска жанра по имени
  const findGenreByName = (genres: Array<{ id: number; name: string }>, name: string) => {
    return genres.find(genre => genre.name.toLowerCase() === name.toLowerCase())
  }

  describe('Преобразование жанров с изображениями', () => {
    it('должен преобразовать все жанры с корректными изображениями', () => {
      const result = mapGenresWithImages(mockGenresFromApi)
      
      expect(result).toHaveLength(10)
      expect(result[0]).toEqual({
        id: 1,
        name: 'Action',
        image: '/images/genres/genre-1.png'
      })
      expect(result[9]).toEqual({
        id: 10,
        name: 'Fantasy',
        image: '/images/genres/genre-10.png'
      })
    })

    it('должен корректно обрабатывать пустой массив', () => {
      const result = mapGenresWithImages([])
      expect(result).toHaveLength(0)
    })

    it('должен генерировать последовательные ID', () => {
      const result = mapGenresWithImages(['A', 'B', 'C', 'D'])
      expect(result.map(g => g.id)).toEqual([1, 2, 3, 4])
    })
  })

  describe('Поиск жанра по ID', () => {
    const genres = mapGenresWithImages(mockGenresFromApi)

    it('должен найти жанр по ID', () => {
      const result = findGenreById(genres, 1)
      expect(result?.name).toBe('Action')
    })

    it('должен вернуть undefined для несуществующего ID', () => {
      const result = findGenreById(genres, 999)
      expect(result).toBeUndefined()
    })
  })

  describe('Поиск жанра по имени', () => {
    const genres = mapGenresWithImages(mockGenresFromApi)

    it('должен найти жанр по точному имени', () => {
      const result = findGenreByName(genres, 'Comedy')
      expect(result?.id).toBe(2)
    })

    it('должен найти жанр без учёта регистра', () => {
      const result = findGenreByName(genres, 'HORROR')
      expect(result?.id).toBe(4)
    })

    it('должен вернуть undefined для несуществующего имени', () => {
      const result = findGenreByName(genres, 'Documentary')
      expect(result).toBeUndefined()
    })
  })
})

describe('Валидация жанра', () => {
  // Функция валидации названия жанра
  const validateGenreName = (name: string): { valid: boolean; error?: string } => {
    if (!name || name.trim().length === 0) {
      return { valid: false, error: 'Название жанра не может быть пустым' }
    }
    
    if (name.length > 50) {
      return { valid: false, error: 'Название жанра слишком длинное' }
    }
    
    // Проверка на допустимые символы (только буквы, дефис, пробел)
    if (!/^[а-яёa-zA-Z\s-]+$/.test(name)) {
      return { valid: false, error: 'Название жанра содержит недопустимые символы' }
    }
    
    return { valid: true }
  }

  it('должен возвращать true для корректного названия', () => {
    expect(validateGenreName('Comedy').valid).toBe(true)
    expect(validateGenreName('Science Fiction').valid).toBe(true)
    expect(validateGenreName('Sci-Fi').valid).toBe(true)
  })

  it('должен возвращать ошибку для пустого названия', () => {
    const result = validateGenreName('')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Название жанра не может быть пустым')
  })

  it('должен возвращать ошибку для слишком длинного названия', () => {
    const result = validateGenreName('A'.repeat(51))
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Название жанра слишком длинное')
  })

  it('должен возвращать ошибку для недопустимых символов', () => {
    const result = validateGenreName('Action!@#')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Название жанра содержит недопустимые символы')
  })
})

describe('Сортировка жанров', () => {
  // Функция сортировки жанров по алфавиту
  const sortGenresAlphabetically = (genres: string[]): string[] => {
    return [...genres].sort((a, b) => a.localeCompare(b))
  }

  // Функция сортировки жанров по длине названия
  const sortGenresByLength = (genres: string[], ascending = true): string[] => {
    const sorted = [...genres].sort((a, b) => a.length - b.length)
    return ascending ? sorted : sorted.reverse()
  }

  it('должен сортировать жанры по алфавиту', () => {
    const genres = ['Zombie', 'Action', 'Comedy']
    const result = sortGenresAlphabetically(genres)
    expect(result).toEqual(['Action', 'Comedy', 'Zombie'])
  })

  it('должен сортировать жанры по длине (по возрастанию)', () => {
    const genres = ['Adventure', 'Drama', 'Action']
    const result = sortGenresByLength(genres, true)
    // Drama=5, Action=6, Adventure=9
    expect(result).toEqual(['Drama', 'Action', 'Adventure'])
  })

  it('должен сортировать жанры по длине (по убыванию)', () => {
    const genres = ['Adventure', 'Drama', 'Action']
    const result = sortGenresByLength(genres, false)
    // Drama=5, Action=6, Adventure=9
    expect(result).toEqual(['Adventure', 'Action', 'Drama'])
  })
})
