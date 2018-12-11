import { types, onSnapshot, onPatch } from 'mobx-state-tree'
import { firebase } from 'api/firebase'

const Author = types.model('Author', {
  id: types.identifier,
  name: types.string,
})

const Book = types.model('Book', {
  id: types.identifier,
  title: types.string,
  status: types.string,
  authors: types.array(Author),
})
  .actions(self => ({
    afterCreate() {
      onSnapshot(self, this.save)
    },
    save(data) {
      console.log(data)
      // TODO: send request to server
    },
    markAsRead() {
      self.status = 'read'
    },
  }))

const Store = types.model('Store', {
  books: types.array(Book),
  authors: types.array(Author),
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

const authors = [
  {id: '22', name: 'Стивен Кинг'},
]

const books = [
  {id: '1', title: 'Бессоница', status: 'now', authors: [{id: '22', name: 'Стивен Кинг'}]},
]

export const store = Store.create({ books, authors })
