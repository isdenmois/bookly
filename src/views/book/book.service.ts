import * as _ from 'lodash'
import { observable, action } from 'mobx'
import { inject } from 'react-ioc'
import { getWorkDetails, FantlabExtendedWork, FantlabGenreGroup } from 'api/fantlab'
import { DataContext } from 'services'

export interface BookExtended {
  id: number
  title: string
  thumbnail?: string
  authors: string
  genres: string[]
  year?: string
  rating?: number
}

export class BookService {
  data = inject(this, DataContext)

  @observable loading: boolean = false
  @observable book: BookExtended = null

  @action fetch(workId) {
    this.loading = true
    this.book = null

    getWorkDetails(workId)
      .then(data => this.setBook(workId, data))
      .finally(() => this.loading = false)
  }

  private setBook(workId: number, data: FantlabExtendedWork) {
    const book: any = _.find(this.data.books, {id: workId}) || {},
          genreGroup: Partial<FantlabGenreGroup> = _.find(_.get(data, 'classificatory.genre_group'), {genre_group_id: '1'} as any) || {genre: []}

    this.book = {
      id: workId,
      title: book.title || data.work_name,
      thumbnail: book.thumbnail || data.image && `http:${data.image}`,
      authors: data.authors.reduce((str, a) => str.concat(a.name), []).join('; '),
      genres: genreGroup.genre.reduce((str, g) => str.concat(g.label), []),
      year: data.work_year,
      rating: book.rating,
    }
  }
}
