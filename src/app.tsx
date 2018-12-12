import * as React from 'react'
import { Font } from 'expo'
import { ActivityIndicator, AsyncStorage } from 'react-native'
import { ApolloProvider } from 'react-apollo'
import { RootStack } from 'states'
import { client } from 'services/client'
import { inject, InjectorContext, provider, toFactory } from 'react-ioc'
import { Books, DataContext, Session, Storage } from './services'

interface State {
  isLoaded: boolean;
}

if (__DEV__) {
  require('./services/reactotron-config')
}

@provider(
  [Storage, AsyncStorage as any],
  Session,
  Books,
  [DataContext, toFactory(DataContext.create)]
)
export default class App extends React.Component {
  static contextType = InjectorContext

  state: State = {
    isLoaded: false,
  }

  session = inject(this, Session)

  componentWillMount() {
    const font    = Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
          }),
          session = this.session.loadSession()

    Promise.all([font, session])
      .catch(() => true)
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
