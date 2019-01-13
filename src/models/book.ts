import { types as t, onSnapshot, Instance, getSnapshot, getRoot } from 'mobx-state-tree'
import { firebase } from 'api/firebase'
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
  WANT_TO_READ = 'wish',
  HAVE_READ = 'read',
  NOW_READING = 'now',
  NONE = 'none',
}

export const BookType = t.enumeration('BookType', [
  'na',
  'novel',
  'shortstory',
  'documental',
  'story',
  'collection',
  'poem',
  'other',
  'piece',
  'cycle',
  'microstory',
  'epic',
])

export const BookS = t.model('Book', {
  id: t.identifierNumber,
  title: t.string,
  status: t.string,
  authors: t.array(t.reference(Author)),
  thumbnail: t.optional(t.string, ''),
  rating: t.optional(t.number, 0),
  date: t.optional(t.Date, 0),
  type: t.optional(t.string, 'na'),
  searchTitles: t.optional(t.string, ''),
  sync: t.optional(t.Date, 0),
})
  .actions(self => ({
    save() {
      const root: any = getRoot(self)

      self.sync = new Date()
      self.authors.forEach(author => author.save())

      firebase.bookSave(root.user, getSnapshot(self))

      root.save()
    },
    changeStatus(status, rating, date) {
      self.status = status

      if (status === 'read') {
        self.rating = rating
        self.date = date
      }

      this.save()
    },
  }))
  .views(self => ({
    get authorsName() {
      return (self.authors || <Author[]>[]).map(a => a.name)
    },
  }))

export type BookS = Instance<typeof BookS>
