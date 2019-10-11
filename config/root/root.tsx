import React from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { Database } from '@nozbe/watermelondb';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-community/async-storage';
import { database, onChanges } from 'store';
import { provider, asValue, asRef } from 'services/inject/provider';

import { Navigation, Session, SyncService, inject } from 'services';
import { API } from 'api';

@provider(asValue(Database, database), asRef(Navigation, 'setNavigation'), Session, API, SyncService)
class App extends React.Component<any> {
  session = inject(Session);
  syncService = inject(SyncService);

  state = { isLoaded: false };
  RootStack: any = null;
  loadNavigationState: Function = null;
  persistNavigationState: Function = null;
  style = { flex: 1 };

  sync = async () => {
    const lastSync: number = +(await AsyncStorage.getItem('lastSync')) || 0;
    const hour = 60 * 60 * 1000;
    const now = Date.now();

    if (now - lastSync > hour) {
      await this.syncService.sync();
      AsyncStorage.setItem('lastSync', now.toString());
    }
  };

  subscription = onChanges.subscribe(this.sync);

  constructor(props, context) {
    super(props, context);

    this.session
      .loadSession()
      .then(() => this.setState({ isLoaded: true }))
      .then(this.sync);
  }

  render() {
    if (!this.state.isLoaded) {
      return <ActivityIndicator />;
    }

    if (!this.RootStack) {
      const routes = require('../router');

      this.RootStack = routes.create(this.session.userId ? 'App' : 'Login');
      SplashScreen.hide();

      if (__DEV__) {
        this.loadNavigationState = routes.loadNavigationState;
        this.persistNavigationState = routes.persistNavigationState;
      }
    }

    const { RootStack, loadNavigationState, persistNavigationState } = this;

    return (
      <View style={this.style}>
        <StatusBar backgroundColor='#fff' barStyle='dark-content' />
        <RootStack
          ref={this.props.setNavigation}
          loadNavigationState={loadNavigationState}
          persistNavigationState={persistNavigationState}
        />
      </View>
    );
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }
}

export default App;
