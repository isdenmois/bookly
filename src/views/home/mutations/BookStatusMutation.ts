import { Mutation, update } from 'modules/api/query'
import * as _ from 'lodash'

export class BookStatusMutation extends Mutation {
  endpoint = 'myBook'
  trigger = ['user_challenge']

  constructor(private book, params) {
    super({...params, bookId: book.id})
  }

  optimisticUpdate(cache) {
    _.set(this.book, 'user_book_partial.book_read', this.params.book_read)
  }
}
