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
