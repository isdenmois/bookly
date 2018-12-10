import { types } from 'mobx-state-tree'
import { firebase } from 'api/firebase'

const Author = types.model('Author', {
  id: types.string,
  name: types.string,
})

const Book = types.model('Book', {
  id: types.string,
  title: types.string,
  authors: types.array(Author),
})

const Store = types.model('Store', {
  books: types.array(Book),
  authors: types.array(Author),
})

export const store = Store.create({
  books: [],
  authors: [],
})
