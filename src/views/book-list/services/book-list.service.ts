import * as _ from 'lodash'
import { action, computed, observable } from 'mobx'
import { inject } from 'react-ioc'

import { filterCollection } from 'utils/filter'
import { DataContext } from 'services'
import { BOOK_READ_STATUS } from 'models/book'

export enum BookListFilters {
  authorId,
}

const BOOK_TYPES = [
  {id: 'novel', name: 'Роман'},
  {id: 'story', name: 'Повесть'},
  {id: 'shortstory', name: 'Рассказ'},
  {id: 'other', name: 'Прочее'},
  {id: 'microstory', name: 'Микрорассказ'},
  {id: 'documental', name: 'Документальное произведение'},
  {id: 'collection', name: 'Сборник'},
  {id: 'poem', name: 'Стихотворение'},
  {id: 'piece', name: 'Пьеса'},
  {id: 'cycle', name: 'Цикл'},
  {id: 'epic', name: 'Роман-эпопея'},
  {id: 'na', name: 'Не определено'},
]

export class BookListService {
  data = inject(this, DataContext)

  title: string
  status: BOOK_READ_STATUS
  sort = 'date'
  authorList = []
  bookTypeList = []
  filters: any = {}

  @observable year: number
  @observable authorId: number
  @observable bookType: string

  constructor(options) {
    this.title = options.title
    this.status = options.status
    this.filters = options.filters

    this.authorList = this.createAuthorList()
    this.bookTypeList = this.createBookTypeList()

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

    if (this.authorId) {
      filters.authors = [{id: this.authorId}]
    }

    if (this.bookType) {
      filters.type = this.bookType
    }

    let books = filterCollection(this.data.books, filters)

    books = _.sortBy(books, this.sort)

    return _.reverse(books)
  }

  createAuthorList() {
    const books = _.filter(this.data.books, {status: this.status}),
          authors = _.flatMap(books, b => b.authors.toJS())

    return _.sortBy(_.uniqBy(authors, 'id'), 'name')
  }

  createBookTypeList() {
    const books = _.filter(this.data.books, {status: this.status}),
          bookTypes = _.uniq(_.map(books, b => b.type))

    return BOOK_TYPES.filter(t => bookTypes.includes(t.id))
  }

  @action setFilters(filters: any) {
    this.year = filters.year
    this.authorId = filters.authorId
    this.bookType = filters.bookType
  }
}
