import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ApolloProvider, Query } from 'react-apollo'
import gql from 'graphql-tag'
import { client } from 'services/client'

const CHALLENGE_QUERY = gql`
    query home($year: Int!, $user: ID!) {
      userChallenge(user: $user, year: $year) {
        countBooksRead
        countBooksForecast
        countBooksTotal
      }
    }
`

class App extends React.Component<any> {
  render() {
    return (
      <ApolloProvider client={client}>
        <Query query={CHALLENGE_QUERY} variables={{year: 2018, user: 'imray'}}>
          {({ loading, error, data }) => (
            <div>hello {JSON.stringify(data)}</div>
          )}
        </Query>
      </ApolloProvider>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
