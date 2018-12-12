import { types as t } from 'mobx-state-tree'
import { Author } from './author'
import { BookS } from './book'

export { Author, BookS }

export default t.model({
  authors: t.array(Author),
  books: t.array(BookS),
})
