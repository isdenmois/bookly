import * as React from 'react'
import { Font } from 'expo'
import { ActivityIndicator, AsyncStorage, StyleSheet, View } from 'react-native'
import { RootStack } from 'states'
import { inject, InjectorContext, provider, toFactory, toValue } from 'react-ioc'
import { Books, DataContext, Session, Storage } from './services'

interface State {
  isLoaded: boolean;
}

if (__DEV__) {
  require('./services/reactotron-config')
}

@provider(
  [Storage, toValue(AsyncStorage)],
  Session,
  Books,
  [DataContext, toFactory([Storage], DataContext.create)]
)
export default class App extends React.Component<any> {
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
      return (
        <View style={s.container}>
          <ActivityIndicator size='large'/>
        </View>
      )
    }

    const navigationPersistenceKey = __DEV__ ? 'NavigationStateDEV' : null

    return (
      <RootStack persistenceKey={navigationPersistenceKey}/>
    )
  }
}

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  }
})
