import { types as t, applySnapshot } from 'mobx-state-tree'
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
})
  .actions(self => ({
    load (user: string) {
      return firebase.userGet(user).then(data => this.save(user, data))
    },
    reload() {
      return firebase.userGet(self.user).then(data => this.save(self.user, data))
    },
    save(user, data) {
      applySnapshot(self, {
        user,
        authors: data.authors,
        books: data.books,
        challenges: data.challenges,
      })
    },
  }))
