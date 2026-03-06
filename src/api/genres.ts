import api from './index'

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
    // Здесь нужно преобразовать строки в объекты Genre
    // Можно использовать маппинг названий жанров на изображения из макета
    return genres.data.map((name, index) => ({
      id: index + 1,
      name,
      image: `/images/genres/${name.toLowerCase()}.jpg`, // Пример пути
    }))
  },
}