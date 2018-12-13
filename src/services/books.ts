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
    return _.filter(this.dataContext.books, {status: BOOK_READ_STATUS.WANT_TO_READ})
  }

  @computed get currentBooks() {
    return _.filter(this.dataContext.books, {status: BOOK_READ_STATUS.NOW_READING})
  }

  @computed get haveRead() {
    return _.filter(this.dataContext.books, {status: BOOK_READ_STATUS.HAVE_READ})
  }

  find(id: number): BookS {
    return _.find(this.dataContext.books, {id: id.toString()})
  }

  @action createFromWork(work: FantlabWork) {
    let author = this.dataContext.authors.get(work.autor_id.toString())

    if (!author) {
      author = Author.create({id: work.autor_id.toString(), name: work.autor_rusname})
      this.dataContext.authors.put(author)
    }

    const book = BookS.create({
      id: work.work_id.toString(),
      authors: [author.id],
      status: BOOK_READ_STATUS.NONE,
      title: work.rusname,
      thumbnail: work.thumbnail,
    })

    this.dataContext.books.push(book)

    return book
  }
}
