import api from './index'
import { getImageUrl } from '@/utils/images'

export interface Genre {
  id: number
  name: string
  image: string
}

export const genresApi = {
  // Получение списка жанров
  getGenres() {
    return api.get<string[]>('/movie/genres')
  },

  // Преобразование массива строк жанров в массив объектов Genre
  async getGenresWithImages(): Promise<Genre[]> {
    const genres = await this.getGenres()
    // Изображения жанров называются genre-1.png, genre-2.png и т.д.
    return genres.data.map((name, index) => ({
      id: index + 1,
      name,
      image: getImageUrl(`/images/genres/genre-${index + 1}.png`),
    }))
  },
}