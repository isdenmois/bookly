import * as _ from 'lodash'
import { action, computed, observable } from 'mobx'
import { api } from '../../../modules/api/api'
import { SessionStore } from '../../../services/SessionStore'

export interface UserChallenge {
  booksCountForecast: number
  booksCountRead: number
  booksCountTotal: number
}

export class HomeStore {
  @observable books: any[]
  @observable challenge: UserChallenge = null

  @computed get currentBooks() {
    return this.books.filter(book => +_.get(book, 'user_book_partial.book_read') === 2)
  }

  constructor(private sessionStore: SessionStore) {
  }

  @action
  async loadCurrentBooks() {
    const fields = 'id,author_name,name,pic_100,user_book_partial(book_read)',
          params = {
            user: this.sessionStore.userId,
            type: 'wish',
            start: 1,
            count: 24,
            fields,
          }

    this.books = await api.userBooks.get(params).catch(() => [])
  }

  @action
  async loadCurrentChallenge() {
    const fields = 'user_challenge(count_books_forecast,count_books_read,status_id,count_books_total)',
          params = {
            user: this.sessionStore.userId,
            year: this.currentYear,
            fields,
          },
          challenge = await api.challenge.get(params).catch(() => null)

    if (!_.isEmpty(challenge)) {
      this.challenge = {
        booksCountForecast: +challenge.user_challenge.count_books_forecast,
        booksCountRead: +challenge.user_challenge.count_books_read,
        booksCountTotal: +challenge.user_challenge.count_books_total,
      }
    } else {
      this.challenge = null
    }
  }

  @action
  async updateBookStatus(book, params) {
    _.set(book, 'user_book_partial.book_read', params.book_read)

    await api.myBook.patch({...params, bookId: book.id})
  }

  private get currentYear() {
    return new Date().getFullYear()
  }
}
