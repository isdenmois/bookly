import * as _ from 'lodash'
import { API_KEY, USER_AGENT } from 'react-native-dotenv'
import { ApiBase, endpoint } from './utlis'

class Api extends ApiBase {
  getBook = endpoint('/books/:bookId')

  /**
   * Книжный вызов
   */
  userChallenge = endpoint('/challenges/:year/readers/:user', {
    method: 'GET',
    fields: f => `user_challenge(${f}`,
    transform: t => _.get(t, 'user_challenge'),
  })

  /**
   * Книги пользователя
   */
  userBooks = endpoint('/users/:user/books/:type')

  /**
   * Поиск книг
   */
  books = endpoint('/books', {
    method: 'GET',
    list: true,
    fields: f => f.replace(/count,books\(/, '').replace(/\)$/, ''),
    transform: t => ({count: t.count, books: t.data}),
  })

  /**
   * Обновление книги пользователя
   */
  updateBook = endpoint('/me/books/:bookId', {
    method: 'PATCH',
    fields: f => f.replace('user_book_partial', 'user_book'),
    transform: t => ({id: t.id, user_book_partial: t.user_book}),
  })
}

export const api = new Api()

api.build()
