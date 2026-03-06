/**
 * Тесты для вспомогательных функций API
 */

describe('Конвертация URL YouTube', () => {
  // Функция конвертации ссылки YouTube в embed ссылку
  const convertToEmbedLink = (watchLink: string): string => {
    try {
      const url = new URL(watchLink)

      // Формат 1: https://www.youtube.com/watch?v=abc123
      let videoId = url.searchParams.get('v')

      // Формат 2: https://youtu.be/abc123
      if (!videoId) {
        const pathParts = url.pathname.split('/').filter(part => part)
        if (pathParts.length > 0) {
          videoId = pathParts[pathParts.length - 1]
        }
      }

      if (!videoId) {
        return ''
      }

      // Очистка от возможных мусорных символов
      videoId = videoId.split('?')[0]

      const embedLink = `https://www.youtube.com/embed/${videoId}`
      return embedLink
    } catch (e) {
      return ''
    }
  }

  describe('Стандартный формат watch', () => {
    it('должен конвертировать стандартную ссылку watch', () => {
      const result = convertToEmbedLink('https://www.youtube.com/watch?v=VYML35ZisMQ')
      expect(result).toBe('https://www.youtube.com/embed/VYML35ZisMQ')
    })

    it('должен обрабатывать ссылку с дополнительными параметрами', () => {
      const result = convertToEmbedLink('https://www.youtube.com/watch?v=abc123&list=PL123')
      expect(result).toBe('https://www.youtube.com/embed/abc123')
    })
  })

  describe('Короткий формат youtu.be', () => {
    it('должен конвертировать короткую ссылку youtu.be', () => {
      const result = convertToEmbedLink('https://youtu.be/VYML35ZisMQ')
      expect(result).toBe('https://www.youtube.com/embed/VYML35ZisMQ')
    })

    it('должен обрабатывать короткую ссылку с параметрами', () => {
      const result = convertToEmbedLink('https://youtu.be/abc123?t=60')
      expect(result).toBe('https://www.youtube.com/embed/abc123')
    })
  })

  describe('Обработка ошибок', () => {
    it('должен возвращать пустую строку для некорректной ссылки', () => {
      expect(convertToEmbedLink('not-a-url')).toBe('')
    })

    it('должен возвращать пустую строку для пустой ссылки', () => {
      expect(convertToEmbedLink('')).toBe('')
    })

    it('должен возвращать пустую строку для ссылки без video ID', () => {
      expect(convertToEmbedLink('https://www.youtube.com/')).toBe('')
    })
  })
})

describe('Форматирование данных фильма', () => {
  // Функция форматирования рейтинга
  const formatRating = (rating: number | undefined | null): string => {
    if (rating === undefined || rating === null) {
      return '—'
    }
    return rating.toFixed(1)
  }

  // Функция форматирования длительности
  const formatDuration = (minutes: number): string => {
    if (!minutes || minutes <= 0) {
      return '—'
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}ч ${mins}мин`
    }
    return `${mins} мин`
  }

  // Функция форматирования бюджета/выручки
  const formatMoney = (amount: string | null | undefined): string => {
    if (!amount) {
      return '—'
    }
    return amount
  }

  describe('Форматирование рейтинга', () => {
    it('должен форматировать корректный рейтинг', () => {
      expect(formatRating(8.5)).toBe('8.5')
      expect(formatRating(10)).toBe('10.0')
      expect(formatRating(7.123)).toBe('7.1')
    })

    it('должен возвращать "—" для null/undefined', () => {
      expect(formatRating(null)).toBe('—')
      expect(formatRating(undefined)).toBe('—')
    })
  })

  describe('Форматирование длительности', () => {
    it('должен форматировать длительность с часами', () => {
      expect(formatDuration(120)).toBe('2ч 0мин')
      expect(formatDuration(150)).toBe('2ч 30мин')
    })

    it('должен форматировать длительность без часов', () => {
      expect(formatDuration(45)).toBe('45 мин')
      expect(formatDuration(90)).toBe('1ч 30мин')
    })

    it('должен возвращать "—" для некорректных значений', () => {
      expect(formatDuration(0)).toBe('—')
      expect(formatDuration(-10)).toBe('—')
      expect(formatDuration(undefined as any)).toBe('—')
    })
  })

  describe('Форматирование денежных сумм', () => {
    it('должен форматировать сумму с долларом', () => {
      expect(formatMoney('$100,000,000')).toBe('$100,000,000')
    })

    it('должен возвращать "—" для пустых значений', () => {
      expect(formatMoney(null)).toBe('—')
      expect(formatMoney(undefined)).toBe('—')
      expect(formatMoney('')).toBe('—')
    })
  })
})

describe('Пагинация', () => {
  // Функция расчёта общего количества страниц
  const calculateTotalPages = (totalItems: number, itemsPerPage: number): number => {
    if (itemsPerPage <= 0) return 0
    return Math.ceil(totalItems / itemsPerPage)
  }

  // Функция получения диапазона страниц для отображения
  const getPageRange = (currentPage: number, totalPages: number, maxVisible: number = 5): number[] => {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const halfVisible = Math.floor(maxVisible / 2)
    let start = currentPage - halfVisible
    let end = currentPage + halfVisible

    if (start <= 0) {
      start = 1
      end = maxVisible
    }

    if (end > totalPages) {
      end = totalPages
      start = totalPages - maxVisible + 1
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  describe('Расчёт количества страниц', () => {
    it('должен правильно рассчитывать количество страниц', () => {
      expect(calculateTotalPages(100, 10)).toBe(10)
      expect(calculateTotalPages(101, 10)).toBe(11)
      expect(calculateTotalPages(50, 10)).toBe(5)
    })

    it('должен возвращать 0 для некорректных параметров', () => {
      expect(calculateTotalPages(100, 0)).toBe(0)
      expect(calculateTotalPages(100, -5)).toBe(0)
    })

    it('должен возвращать 1 страницу если элементов меньше чем на страницу', () => {
      expect(calculateTotalPages(5, 10)).toBe(1)
      expect(calculateTotalPages(0, 10)).toBe(0)
    })
  })

  describe('Получение диапазона страниц', () => {
    it('должен возвращать все страницы если их меньше максимума', () => {
      expect(getPageRange(1, 3, 5)).toEqual([1, 2, 3])
    })

    it('должен возвращать корректный диапазон для середины', () => {
      expect(getPageRange(5, 10, 5)).toEqual([3, 4, 5, 6, 7])
    })

    it('должен возвращать корректный диапазон для начала', () => {
      expect(getPageRange(1, 10, 5)).toEqual([1, 2, 3, 4, 5])
    })

    it('должен возвращать корректный диапазон для конца', () => {
      expect(getPageRange(10, 10, 5)).toEqual([6, 7, 8, 9, 10])
    })
  })
})
