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
  cmp: any = null;

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

    if (!this.cmp) {
      this.cmp = require('../router/routes').create(this.session.userId ? 'App' : 'Login');
      SplashScreen.hide();
    }

    const RootStack = this.cmp;

    const navigationPersistenceKey = __DEV__ ? 'NavigationStateDEV' : null;

    return <RootStack persistenceKey={navigationPersistenceKey} />;
  }
}

export default App;
