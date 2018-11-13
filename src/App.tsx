import * as React from 'react'
import { Font } from 'expo'
import { Provider } from 'mobx-react'
import { ActivityIndicator } from 'react-native'
import { ApolloProvider } from 'react-apollo'
import { RootStack } from 'states/main'
import { store, sessionStore } from 'services/store'
import { client } from 'services/apollo-client-bridge'

interface State {
  isLoaded: boolean;
}

if (__DEV__) {
  require('./services/ReactotronConfig')
}

export default class App extends React.Component {
  state: State = {
    isLoaded: false,
  }

  componentWillMount() {
    const font    = Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
          }),
          session = sessionStore.loadSession()

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
        <Provider {...store}>
          <RootStack/>
        </Provider>
      </ApolloProvider>
    )
  }
}
