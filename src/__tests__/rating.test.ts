/**
 * Тесты для утилит работы с рейтингом фильмов
 */

import { getRatingClass } from '../utils/rating'

describe('Функция getRatingClass', () => {
  describe('Без префикса (по умолчанию search__card-rating)', () => {
    it('должен возвращать --outline для null рейтинга', () => {
      expect(getRatingClass(null)).toBe('search__card-rating--outline')
    })

    it('должен возвращать --outline для undefined рейтинга', () => {
      expect(getRatingClass(undefined)).toBe('search__card-rating--outline')
    })

    it('должен возвращать --green для рейтинга >= 8', () => {
      expect(getRatingClass(8)).toBe('search__card-rating--green')
      expect(getRatingClass(9)).toBe('search__card-rating--green')
      expect(getRatingClass(10)).toBe('search__card-rating--green')
    })

    it('должен возвращать --gold для рейтинга >= 7 и < 8', () => {
      expect(getRatingClass(7)).toBe('search__card-rating--gold')
      expect(getRatingClass(7.5)).toBe('search__card-rating--gold')
      expect(getRatingClass(7.9)).toBe('search__card-rating--gold')
    })

    it('должен возвращать --grey для рейтинга >= 5 и < 7', () => {
      expect(getRatingClass(5)).toBe('search__card-rating--grey')
      expect(getRatingClass(6)).toBe('search__card-rating--grey')
      expect(getRatingClass(6.9)).toBe('search__card-rating--grey')
    })

    it('должен возвращать --outline для рейтинга >= 3 и < 5', () => {
      expect(getRatingClass(3)).toBe('search__card-rating--outline')
      expect(getRatingClass(4)).toBe('search__card-rating--outline')
      expect(getRatingClass(4.9)).toBe('search__card-rating--outline')
    })

    it('должен возвращать --red для рейтинга < 3', () => {
      expect(getRatingClass(0)).toBe('search__card-rating--red')
      expect(getRatingClass(1)).toBe('search__card-rating--red')
      expect(getRatingClass(2.9)).toBe('search__card-rating--red')
    })
  })

  describe('С префиксом random-film__rating', () => {
    it('должен возвращать корректный класс с префиксом random-film__rating', () => {
      expect(getRatingClass(8, 'random-film__rating')).toBe('random-film__rating--green')
      expect(getRatingClass(7, 'random-film__rating')).toBe('random-film__rating--gold')
      expect(getRatingClass(5, 'random-film__rating')).toBe('random-film__rating--grey')
      expect(getRatingClass(2, 'random-film__rating')).toBe('random-film__rating--red')
      expect(getRatingClass(null, 'random-film__rating')).toBe('random-film__rating--outline')
    })
  })

  describe('С префиксом film__rating', () => {
    it('должен возвращать корректный класс с префиксом film__rating', () => {
      expect(getRatingClass(8.5, 'film__rating')).toBe('film__rating--green')
      expect(getRatingClass(7.2, 'film__rating')).toBe('film__rating--gold')
      expect(getRatingClass(5.5, 'film__rating')).toBe('film__rating--grey')
      expect(getRatingClass(3.5, 'film__rating')).toBe('film__rating--outline')
      expect(getRatingClass(2.5, 'film__rating')).toBe('film__rating--red')
    })
  })

  describe('Граничные значения', () => {
    it('должен корректно обрабатывать рейтинг 0', () => {
      expect(getRatingClass(0)).toBe('search__card-rating--red')
    })

    it('должен корректно обрабатывать рейтинг 10', () => {
      expect(getRatingClass(10)).toBe('search__card-rating--green')
    })

    it('должен корректно обрабатывать дробные значения', () => {
      expect(getRatingClass(7.999)).toBe('search__card-rating--gold')
      expect(getRatingClass(4.001)).toBe('search__card-rating--outline')
    })
  })
})
