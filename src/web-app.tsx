import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import { AppRegistry, View } from 'react-native'
import gql from 'graphql-tag'
import { provider, toFactory } from 'react-ioc'
import { Provider } from 'mobx-react'
import { RootStack } from 'states'
import { client } from 'services/client'
import { store as mobxStore } from 'services/store'
import { DataContext } from 'services'
const nativeBase = require('native-base-web')

const CHALLENGE_QUERY = gql`
    query home($year: Int!, $user: ID!) {
      userChallenge(user: $user, year: $year) {
        countBooksRead
        countBooksForecast
        countBooksTotal
      }
    }
`

@provider([DataContext, toFactory(DataContext.create)])
class App extends React.Component<any> {
  render() {
    return (
      <ApolloProvider client={client}>
        <Provider {...mobxStore}>
          <RootStack/>
        </Provider>
      </ApolloProvider>
    )
  }
}

const Container1 = nativeBase.Container
const Container2 = props => <Container1 style={props.style}><View>{props.children}</View></Container1>

Object.assign(nativeBase, {Container: Container2, Header: View, Item: View, Form: View, DatePicker: View, Left: View})

AppRegistry.registerComponent('App', () => App)
AppRegistry.runApplication('App', { rootTag: document.getElementById('app') })
