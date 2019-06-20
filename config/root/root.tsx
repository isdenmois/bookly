import React from 'react';
import { inject, InjectorContext, provider, toValue } from 'react-ioc';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Database } from '@nozbe/watermelondb';
import SplashScreen from 'react-native-splash-screen';
import { Session, SyncService, Storage } from 'services';
import { database } from 'store';
import { providers } from '../providers';

const injections: any = [...providers, [Storage, toValue(AsyncStorage)], [Database, toValue(database)]];

@provider(...injections)
class App extends React.Component {
  static contextType = InjectorContext;

  session = inject(this, Session);
  syncService = inject(this, SyncService);
  state = { isLoaded: false };
  RootStack: any = null;
  loadNavigationState: Function = null;
  persistNavigationState: Function = null;

  constructor(props, context) {
    super(props, context);

    this.session
      .loadSession()
      .then(() => this.setState({ isLoaded: true }))
      .then(() => this.syncService.sync());
  }

  render() {
    if (!this.state.isLoaded) {
      return <ActivityIndicator />;
    }

    if (!this.RootStack) {
      const routes = require('../router/routes');

      this.RootStack = routes.create(this.session.userId ? 'App' : 'Login');
      SplashScreen.hide();

      if (__DEV__) {
        this.loadNavigationState = routes.loadNavigationState;
        this.persistNavigationState = routes.persistNavigationState;
      }
    }

    const { RootStack, loadNavigationState, persistNavigationState } = this;

    return <RootStack loadNavigationState={loadNavigationState} persistNavigationState={persistNavigationState} />;
  }
}

export default App;
