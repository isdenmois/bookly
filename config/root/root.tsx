import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Database } from '@nozbe/watermelondb';
import SplashScreen from 'react-native-splash-screen';
import { database } from 'store';
import { provider, asValue, asRef } from 'services/inject/provider';

import { Navigation, Session, SyncService, inject } from 'services';
import { FirebaseAPI, FantlabAPI } from 'api';

@provider(
  asValue(Database, database),
  asRef(Navigation, 'setNavigation'),
  Session,
  FirebaseAPI,
  FantlabAPI,
  SyncService,
)
class App extends React.Component<any> {
  session = inject(Session);
  syncService = inject(SyncService);

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
      <RootStack
        ref={this.props.setNavigation}
        loadNavigationState={loadNavigationState}
        persistNavigationState={persistNavigationState}
      />
    );
  }
}

export default App;
