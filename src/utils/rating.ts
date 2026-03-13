/**
 * Утилиты для работы с рейтингом фильмов
 */

/**
 * Типы классов рейтинга
 */
export type RatingClass = 
  | 'random-film__rating--green'
  | 'random-film__rating--gold'
  | 'random-film__rating--grey'
  | 'random-film__rating--red'
  | 'random-film__rating--outline'
  | 'film__rating--green'
  | 'film__rating--gold'
  | 'film__rating--grey'
  | 'film__rating--red'
  | 'film__rating--outline'
  | 'search__card-rating--green'
  | 'search__card-rating--gold'
  | 'search__card-rating--grey'
  | 'search__card-rating--red'
  | 'search__card-rating--outline'

/**
 * Возвращает класс рейтинга в зависимости от его значения
 * 
 * @param rating - рейтинг фильма (от 0 до 10)
 * @param prefix - префикс класса (random-film, film, search__card)
 * @returns класс для блока рейтинга
 * 
 * Логика:
 * - rating >= 8: green (отличный)
 * - rating >= 7: gold (очень хороший)
 * - rating >= 5: grey (средний)
 * - rating >= 3: outline (ниже среднего)
 * - rating < 3: red (плохой)
 * - rating отсутствует: outline
 */
export const getRatingClass = (rating: number | undefined | null, prefix: string = 'search__card-rating'): RatingClass => {
  if (rating === undefined || rating === null) {
    return `${prefix}--outline` as RatingClass
  }
  
  if (rating >= 8) {
    return `${prefix}--green` as RatingClass
  }
  if (rating >= 7) {
    return `${prefix}--gold` as RatingClass
  }
  if (rating >= 5) {
    return `${prefix}--grey` as RatingClass
  }
  if (rating >= 3) {
    return `${prefix}--outline` as RatingClass
  }
  return `${prefix}--red` as RatingClass
}
