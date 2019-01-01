import * as _ from 'lodash'
import { types as t, applySnapshot, getEnv } from 'mobx-state-tree'
import { firebase } from 'api/firebase'
import { Author } from './author'
import { BookS } from './book'
import { UserChallenge } from './user-challenge'

export { Author, BookS }

export default t.model({
  user: t.optional(t.string, ''),
  authors: t.optional(t.map(Author), {}),
  books: t.optional(t.array(BookS), []),
  challenges: t.optional(t.map(UserChallenge), {}),
  sync: t.number,
})
  .actions(self => ({
    load(user: string, sync: number) {
      const promises = [
        firebase.authorsGet(user, sync),
        firebase.booksGet(user, sync),
        firebase.challengesGet(user),
      ]

      return Promise
        .all(promises)
        .then(([authors, books, challenges]) => {
          this.applyData(user, {authors, books, challenges}, sync > 0)

          if (!_.isEmpty(authors) || !_.isEmpty(books)) {
            this.save()
          }
        })
    },

    syncFirebase() {
      return this.load(self.user, self.sync)
    },

    reload() {
      return this.load(self.user, 0)
    },

    save() {
      const storage = getEnv(self).storage,
            authors = JSON.stringify((self.authors as any).toJSON()),
            books = JSON.stringify((self.books as any).toJSON()),
            sync = self.sync.toString()

      storage.setItem('authors', authors)
      storage.setItem('books', books)
      storage.setItem('sync', sync)
    },

    async restore(user?: string) {
      let storage = getEnv(self).storage,
          books = (await storage.getItem('books')) || '[]',
          authors = (await storage.getItem('authors')) || '{}',
          sync = (await storage.getItem('sync')) || 0

      self.books = JSON.parse(books)
      self.authors = JSON.parse(authors)
      self.sync = +sync

      this.load(user || self.user, self.sync)
    },

    applyData(user, data, append: boolean) {
      applySnapshot(self, {
        user,
        authors: append ? _.merge({}, (self.authors as any).toJSON(), data.authors) : data.authors,
        books: _.uniqBy(append ? _.concat((self.books as any).toJSON(), data.books) : data.books, 'id') as any,
        challenges: data.challenges,
        sync: Date.now(),
      })
    },
  }))
