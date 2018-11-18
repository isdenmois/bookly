import gql from 'graphql-tag'

export const MARK_AS_READ_MUTATION = gql`
  mutation markAsRead($bookId: ID!, $status: Int!, $rating: Int, $dateDay: Int, $dateMonth: Int, $dateYear: Int) {
    changeStatus(bookId: $bookId, bookRead: $status, rating: $rating, dateDay: $dateDay, dateMonth: $dateMonth, dateYear: $dateYear) {
      id
      userBookPartial {
        bookRead
        dateDay
        dateMonth
        dateYear
        rating
      }
    }
  }
`

export const CHANGE_STATUS_MUTATION = gql`
  mutation changeStatus($bookId: ID!, $status: Int!) {
    changeStatus(bookId: $bookId, bookRead: $status) {
      id
      userBookPartial {
        bookRead
        dateDay
        dateMonth
        dateYear
        rating
      }
    }
  }
`
