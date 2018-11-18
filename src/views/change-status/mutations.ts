import gql from 'graphql-tag'

export const MARK_AS_READ_MUTATION = gql`
  mutation markAsRead($bookId: ID!, $status: Int!, $rating: Int, $date_day: Int, $date_month: Int, $date_year: Int) {
    changeStatus(bookId: $bookId, book_read: $status, rating: $rating, date_day: $date_day, date_month: $date_month, date_year: $date_year) {
      id
      user_book_partial {
        book_read
        date_day
        date_month
        date_year
        rating
      }
    }
  }
`

export const CHANGE_STATUS_MUTATION = gql`
  mutation changeStatus($bookId: ID!, $status: Int!) {
    changeStatus(bookId: $bookId, book_read: $status) {
      id
      user_book_partial {
        book_read
        date_day
        date_month
        date_year
        rating
      }
    }
  }
`
