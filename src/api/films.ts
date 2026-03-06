import api from './index'

export interface Film {
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

export interface FilmsResponse {
  films: Film[]
  total: number
  page: number
  limit: number
}

export const filmsApi = {
  // Получение списка фильмов с пагинацией
  getFilms(page = 1, limit = 10) {
    return api.get<Film[]>(`/movie?page=${page}&limit=${limit}`)
  },

  // Получение фильма по ID
  getFilmById(id: number) {
    return api.get<Film>(`/movie/${id}`)
  },

  // Получение случайного фильма
  getRandomFilm() {
    return api.get<Film>('/movie/random')
  },

  // Получение топ фильмов
  getTopFilms(limit = 10) {
    return api.get<Film[]>(`/movie/top10`)
  },

  // Поиск фильмов по названию
  searchFilms(query: string, page = 1, limit = 10) {
    return api.get<Film[]>(`/movie/search?query=${query}&page=${page}&limit=${limit}`)
  },

  // Получение фильмов по жанру
  getFilmsByGenre(genre: string, page = 1, limit = 10) {
    return api.get<Film[]>(`/movie?genre=${genre}&page=${page}&limit=${limit}`)
  },
}