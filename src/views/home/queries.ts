import gql from 'graphql-tag'

export const USER_CHALLENGE_QUERY = gql`
  query userChallenge($user: ID!, $year: Int!) {
    userChallenge(user: $user, year: $year) {
      count_books_read
      count_books_total
      count_books_forecast
    }
  }
`

export const USER_BOOKS_QUERY = gql`
  query userBooks($user: ID!, $type: String, $count: Int, $start: Int) {
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
