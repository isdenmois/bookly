import gql from 'graphql-tag'

export const USER_CHALLENGE_QUERY = gql`
  query userChallenge($user: ID!, $year: Int!) {
    userChallenge(user: $user, year: $year) {
      countBooksRead
      countBooksTotal
      countBooksForecast
    }
  }
`

export const USER_BOOKS_QUERY = gql`
  query userBooks($user: ID!, $type: String, $count: Int, $start: Int) {
    userBooks(user: $user, type: $type, count: $count, start: $start) {
      id
      authorName
      name
      pic100
      userBookPartial {
        bookRead
      }
    }
  }
`

export const BOOK_LIST_QUERY = gql`
  {
    books {
      id
      author
      title
      status
    }
  }
`
