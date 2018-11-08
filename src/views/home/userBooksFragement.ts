import gql from 'graphql-tag'

// TODO: разделить на 2 запроса
export const HOME_SCREEN_QUERY = gql`
  query home($count: Int, $start: Int, $type: String, $year: Int!, $user: ID!) {
    userChallenge(user: $user, year: $year) {
      count_books_read
      count_books_total
      count_books_forecast
    }

    userBooks(user: $user, type: $type, count: $count, start: $start) {
      id
      author_name
      name
      pic_100
      user_book_partial {
        book_read
      }
    }
  }
`
