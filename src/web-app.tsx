import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import { ActivityIndicator, AppRegistry, View } from 'react-native'
import { inject, InjectorContext, provider, toFactory } from 'react-ioc'
import { RootStack } from 'states'
import { client } from 'services/client'
import { Books, DataContext, Session, Storage } from 'services'
const nativeBase = require('native-base-web')

interface State {
  isLoaded: boolean;
}

@provider(Storage, Session, Books, [DataContext, toFactory(DataContext.create)])
class App extends React.Component<any> {
  static contextType = InjectorContext

  state: State = {
    isLoaded: false,
  }

  session = inject(this, Session)

  componentWillMount() {
    this.session.loadSession()
      .then(() => this.setState({isLoaded: true}))
  }

  render() {
    if (!this.state.isLoaded) {
      return <ActivityIndicator/>
    }

    return (
      <ApolloProvider client={client}>
        <RootStack/>
      </ApolloProvider>
    )
  }
}

const Container1 = nativeBase.Container
const Container2 = props => <Container1 style={props.style}><View>{props.children}</View></Container1>

Object.assign(nativeBase, {
  Container: Container2,
  Header: View, Item: View, Form: View, DatePicker: View, Left: View, Body: View, Right: View,
})

AppRegistry.registerComponent('App', () => App)
AppRegistry.runApplication('App', { rootTag: document.getElementById('app') })
