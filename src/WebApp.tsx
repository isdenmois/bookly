import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ApolloProvider, Query } from 'react-apollo'
import gql from 'graphql-tag'
import { client } from 'services/apollo-client-bridge'

const CHALLENGE_QUERY = gql`
    query home($year: Int!, $user: ID!) {
      userChallenge(user: $user, year: $year) {
        count_books_read
        count_books_total
        count_books_forecast
      }
    }
`

class App extends React.Component<any> {
  render() {
    return (
      <ApolloProvider client={client}>
        <Query query={CHALLENGE_QUERY} variables={{year: 2018, user: 'imray'}}>
          {({ loading, error, data }) => (
            <div>hello</div>
          )}
        </Query>
      </ApolloProvider>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
