import { types as t } from 'mobx-state-tree'
import { Author } from './author'
import { BookS } from './book'

export { Author, BookS }

export default t.model({
  authors: t.array(Author),
  books: t.array(BookS),
})
.actions(self => ({
  afterCreate() {
    this.load()
  },
  load() {
    // TODO: load books.
  },
  add(book) {
      self.books.push(book)
  },
})).views(self => ({
  get wish() {
    return self.books.filter(b => b.status === 'wish')
  },
  get now() {
    return self.books.filter(b => b.status === 'now')
  },
  get read() {
    return self.books.filter(b => b.status === 'read')
  },
}))
