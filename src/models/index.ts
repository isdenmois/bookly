import { types as t } from 'mobx-state-tree'
import { Author } from './author'
import { BookS } from './book'
import { UserChallenge } from './user-challenge'

export { Author, BookS }

export default t.model({
  authors: t.map(Author),
  books: t.array(BookS),
  challenges: t.map(UserChallenge),
})
