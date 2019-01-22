import * as _ from 'lodash'
import { inject } from 'react-ioc'
import { action, computed } from 'mobx'
import { Author, BookS } from 'models'
import { BOOK_READ_STATUS } from 'models/book'
import { FantlabWork } from 'api/fantlab'
import { DataContext } from './data-context'

export class Books {
  dataContext = inject(this, DataContext)

  @computed get wantToRead() {
    const books = _.filter(this.dataContext.books, {status: BOOK_READ_STATUS.WANT_TO_READ})

    return _.sortBy(books, 'title')
  }

  @computed get currentBooks() {
    return _.filter(this.dataContext.books, {status: BOOK_READ_STATUS.NOW_READING})
  }

  @computed get haveRead() {
    let books = _.filter(this.dataContext.books, {status: BOOK_READ_STATUS.HAVE_READ})

    books = _.sortBy(books, 'date')

    return _.reverse(books)
  }

  find(id: number): BookS {
    return _.find(this.dataContext.books, {id: id})
  }

  @action createFromWork(work: FantlabWork) {
    let author = this.dataContext.authors.get(work.autor_id.toString())

    if (!author) {
      author = Author.create({id: work.autor_id, name: work.autor_rusname})
      this.dataContext.authors.put(author)
    }

    const book = BookS.create({
      id: work.work_id,
      authors: [author.id],
      status: BOOK_READ_STATUS.NONE,
      title: work.rusname,
      thumbnail: work.thumbnail,
      type: work.name_eng as any,
      searchTitles: [work.name, work.rusname, work.altname].filter(_.identity).join('; '),
    })

    this.dataContext.books.push(book)

    return book
  }
}
