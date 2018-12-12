import { types as t, onSnapshot, Instance } from 'mobx-state-tree'
import { Author } from './author'

export interface UserBookPartial {
  bookRead: BOOK_READ_STATUS
  rating: number
  dateDay: number
  dateMonth: number
  dateYear: number
}

export interface Book {
  id: string
  authorId: number
  authorName: string
  name: string
  avgMark: number
  pic70: string
  pic100: string
  pic140: string
  pic200: string
  userBookPartial: UserBookPartial
}

export enum BOOK_READ_STATUS {
  WANT_TO_READ = 0,
  HAVE_READ,
  NOW_READING,
}

export const BookS = t.model('Book', {
  id: t.identifier,
  title: t.string,
  status: t.string,
  authors: t.array(t.reference(Author)),
  thumbnail: t.string,
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
  .views(self => ({
    get authorsName() {
      return (self.authors || <Author[]>[]).map(a => a.name)
    },
  }))

export type BookS = Instance<typeof BookS>
