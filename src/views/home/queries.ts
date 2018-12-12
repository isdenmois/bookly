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
