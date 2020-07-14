import React from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import 'mobx-react-lite/batchingForReactDom';
import { onChanges } from 'store';

import { session, syncService, navigation } from 'services';
import { create } from '../router';

class App extends React.Component<any> {
  state = { isLoaded: false };
  stack: any = null;
  style = { flex: 1 };

  sync = async () => {
    const lastSync: number = +(await AsyncStorage.getItem('lastSync')) || 0;
    const hour = 60 * 60 * 1000;
    const now = Date.now();

    if (now - lastSync > hour) {
      await syncService.sync();
      AsyncStorage.setItem('lastSync', now.toString());
    }
  };

  subscription = onChanges.subscribe(() => syncService.sync());

  constructor(props, context) {
    super(props, context);

    session
      .loadSession()
      .then(() => this.setState({ isLoaded: true }))
      .then(this.sync);
  }

  render() {
    if (!this.state.isLoaded) {
      return <ActivityIndicator />;
    }

    if (!this.stack) {
      this.stack = create(session.userId ? 'App' : 'Login');
    }

    const RootStack = this.stack;

    return (
      <View style={this.style}>
        <StatusBar backgroundColor='#fff' barStyle='dark-content' />
        <RootStack ref={navigation.setRef} />
      </View>
    );
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }
}

export default App;
