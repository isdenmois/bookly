import * as _ from 'lodash'
import { action, computed, observable } from 'mobx'
import { inject } from 'react-ioc'

import { filterCollection } from 'utils/filter'
import { DataContext } from 'services'
import { BOOK_READ_STATUS } from 'models/book'

export enum BookListFilters {
  authorId,
}

export class BookListService {
  data = inject(this, DataContext)

  title: string
  status: BOOK_READ_STATUS
  sort = 'date'
  filters: any = {}

  @observable year: number

  constructor(options) {
    this.title = options.title
    this.status = options.status
    this.filters = options.filters

    this.setFilters(options)
  }

  @computed get books() {
    const filters: any = {status: this.status}

    if (this.year) {
      filters.date = {
        from: new Date(this.year, 0, 1, 0, 0, 0),
        to:  new Date(this.year, 11, 31, 23, 59, 59),
      }
    }

    let books = filterCollection(this.data.books, filters)

    books = _.sortBy(books, this.sort)

    return _.reverse(books)
  }

  @action setFilters(filters: any) {
    this.year = filters.year
  }
}
