import * as _ from 'lodash'
import { action, observable } from 'mobx'
import { api } from '../../../modules/api/api'
import { SessionStore } from '../../../services/SessionStore'

export class HomeStore {
  @observable currentBooks: any[]

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

    this.currentBooks = await api.userBooks.get(params).catch(() => [])
    this.currentBooks = this.currentBooks.filter(book => +_.get(book, 'user_book_partial.book_read') === 2)
  }
}
