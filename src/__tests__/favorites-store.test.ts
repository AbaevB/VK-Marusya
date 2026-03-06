/**
 * Тесты для функций работы с избранным
 */

// Мок типа Film
interface Film {
  id: number
  title: string
  originalTitle: string
  plot: string
  releaseYear: number
  tmdbRating: number
  genres: string[]
  posterUrl: string
  backdropUrl: string
  trailerUrl: string
  trailerYouTubeId: string
  runtime: number
  director: string
  cast: string[]
  language: string
  releaseDate: string
  budget: string | null
  revenue: string | null
  homepage: string
  status: string
  searchL: string
  keywords: string[]
  countriesOfOrigin: string[]
  languages: string[]
  production: string | null
  awardsSummary: string | null
}

// Мок данных фильмов для тестов
const mockFilms: Film[] = [
  {
    id: 1,
    title: 'Тестовый фильм 1',
    originalTitle: 'Test Movie 1',
    plot: 'Описание фильма 1',
    releaseYear: 2023,
    tmdbRating: 8.5,
    genres: ['Action', 'Drama'],
    posterUrl: '/images/poster1.jpg',
    backdropUrl: '/images/backdrop1.jpg',
    trailerUrl: 'https://youtube.com/embed/abc123',
    trailerYouTubeId: 'abc123',
    runtime: 120,
    director: 'Режиссер 1',
    cast: ['Актер 1', 'Актер 2'],
    language: 'en',
    releaseDate: '2023-01-01',
    budget: '$100,000,000',
    revenue: '$300,000,000',
    homepage: 'https://example.com',
    status: 'Released',
    searchL: 'test movie 1',
    keywords: ['action', 'drama'],
    countriesOfOrigin: ['USA'],
    languages: ['English'],
    production: 'Studio Name',
    awardsSummary: '2 Oscar wins'
  },
  {
    id: 2,
    title: 'Тестовый фильм 2',
    originalTitle: 'Test Movie 2',
    plot: 'Описание фильма 2',
    releaseYear: 2022,
    tmdbRating: 7.8,
    genres: ['Comedy'],
    posterUrl: '/images/poster2.jpg',
    backdropUrl: '/images/backdrop2.jpg',
    trailerUrl: 'https://youtube.com/embed/def456',
    trailerYouTubeId: 'def456',
    runtime: 95,
    director: 'Режиссер 2',
    cast: ['Актер 3'],
    language: 'en',
    releaseDate: '2022-06-15',
    budget: '$50,000,000',
    revenue: '$150,000,000',
    homepage: '',
    status: 'Released',
    searchL: 'test movie 2',
    keywords: ['comedy'],
    countriesOfOrigin: ['USA'],
    languages: ['English'],
    production: 'Studio Name 2',
    awardsSummary: null
  }
]

describe('Функции работы с избранным', () => {
  // Симуляция хранилища избранного
  let favorites: Film[] = []

  // Функция добавления в избранное
  const addToFavorites = (film: Film): void => {
    if (!isFavorite(film.id)) {
      favorites.push(film)
    }
  }

  // Функция удаления из избранного
  const removeFromFavorites = (filmId: number): void => {
    favorites = favorites.filter(film => film.id !== filmId)
  }

  // Функция проверки, находится ли фильм в избранном
  const isFavorite = (filmId: number): boolean => {
    return favorites.some(film => film.id === filmId)
  }

  // Функция переключения избранного
  const toggleFavorite = (film: Film): string => {
    if (isFavorite(film.id)) {
      removeFromFavorites(film.id)
      return 'removed'
    } else {
      addToFavorites(film)
      return 'added'
    }
  }

  beforeEach(() => {
    // Сброс состояния перед каждым тестом
    favorites = []
  })

  describe('Добавление в избранное', () => {
    it('должен добавить фильм в избранное', () => {
      addToFavorites(mockFilms[0])
      expect(favorites).toHaveLength(1)
      expect(favorites[0].id).toBe(1)
    })

    it('не должен добавлять дубликаты', () => {
      addToFavorites(mockFilms[0])
      addToFavorites(mockFilms[0])
      expect(favorites).toHaveLength(1)
    })

    it('должен добавлять несколько разных фильмов', () => {
      addToFavorites(mockFilms[0])
      addToFavorites(mockFilms[1])
      expect(favorites).toHaveLength(2)
    })
  })

  describe('Удаление из избранного', () => {
    it('должен удалить фильм из избранного', () => {
      favorites = [...mockFilms]
      removeFromFavorites(1)
      expect(favorites).toHaveLength(1)
      expect(favorites[0].id).toBe(2)
    })

    it('не должен вызывать ошибку при удалении несуществующего фильма', () => {
      favorites = [mockFilms[0]]
      expect(() => removeFromFavorites(999)).not.toThrow()
      expect(favorites).toHaveLength(1)
    })
  })

  describe('Проверка избранного', () => {
    it('должен возвращать true для избранного фильма', () => {
      favorites = [mockFilms[0]]
      expect(isFavorite(1)).toBe(true)
    })

    it('должен возвращать false для не избранного фильма', () => {
      favorites = [mockFilms[0]]
      expect(isFavorite(2)).toBe(false)
    })

    it('должен возвращать false для пустого списка избранного', () => {
      expect(isFavorite(1)).toBe(false)
    })
  })

  describe('Переключение избранного', () => {
    it('должен добавить фильм если его нет в избранном', () => {
      const result = toggleFavorite(mockFilms[0])
      expect(result).toBe('added')
      expect(favorites).toHaveLength(1)
    })

    it('должен удалить фильм если он есть в избранном', () => {
      favorites = [mockFilms[0]]
      const result = toggleFavorite(mockFilms[0])
      expect(result).toBe('removed')
      expect(favorites).toHaveLength(0)
    })
  })

  describe('Получение списка избранного', () => {
    it('должен возвращать пустой массив если избранного нет', () => {
      expect(favorites).toEqual([])
    })

    it('должен возвращать все избранные фильмы', () => {
      favorites = [...mockFilms]
      expect(favorites).toHaveLength(2)
      expect(favorites.map(f => f.id)).toEqual([1, 2])
    })
  })
})

describe('Валидация данных фильма', () => {
  // Функция проверки корректности данных фильма
  const validateFilm = (film: Partial<Film>): { valid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!film.id || typeof film.id !== 'number') {
      errors.push('ID фильма обязателен')
    }

    if (!film.title || typeof film.title !== 'string') {
      errors.push('Название фильма обязательно')
    }

    if (!film.posterUrl || typeof film.posterUrl !== 'string') {
      errors.push('Постер фильма обязателен')
    }

    if (film.tmdbRating !== undefined && (film.tmdbRating < 0 || film.tmdbRating > 10)) {
      errors.push('Рейтинг должен быть от 0 до 10')
    }

    if (film.runtime !== undefined && film.runtime < 0) {
      errors.push('Длительность не может быть отрицательной')
    }

    return { valid: errors.length === 0, errors }
  }

  it('должен возвращать ошибки для пустого фильма', () => {
    const result = validateFilm({})
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('ID фильма обязателен')
    expect(result.errors).toContain('Название фильма обязательно')
    expect(result.errors).toContain('Постер фильма обязателен')
  })

  it('должен возвращать true для корректного фильма', () => {
    const result = validateFilm({
      id: 1,
      title: 'Тест',
      posterUrl: '/image.jpg',
      tmdbRating: 8.5,
      runtime: 120
    })
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('должен возвращать ошибку для некорректного рейтинга', () => {
    const result = validateFilm({
      id: 1,
      title: 'Тест',
      posterUrl: '/image.jpg',
      tmdbRating: 15
    })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Рейтинг должен быть от 0 до 10')
  })

  it('должен возвращать ошибку для отрицательной длительности', () => {
    const result = validateFilm({
      id: 1,
      title: 'Тест',
      posterUrl: '/image.jpg',
      runtime: -10
    })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Длительность не может быть отрицательной')
  })
})
