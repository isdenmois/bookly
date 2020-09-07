import React from 'react';
import { ActivityIndicator, StatusBar, View, ViewStyle } from 'react-native';
import { observer } from 'mobx-react';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-community/async-storage';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { ColorSchemeProvider, ColorSchemeContext } from 'react-native-dynamic';
import { onChanges } from 'store';
import { i18n } from 'services/i18n';

import { session, syncService, navigation } from 'services';
import { dark, color } from 'types/colors';

@observer
class App extends React.Component<any> {
  state = { isLoaded: false };
  RootStack: any = null;
  loadNavigationState: Function = null;
  persistNavigationState: Function = null;
  style: ViewStyle = { flex: 1 };

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

    Promise.all([session.loadSession(), i18n.init()])
      .then(() => this.setState({ isLoaded: true }))
      .then(this.sync);
  }

  render() {
    if (!this.state.isLoaded) {
      return <ActivityIndicator />;
    }

    if (!this.RootStack) {
      const routes = require('../router');

      this.RootStack = routes.create(session.userId ? 'App' : 'Login');
      SplashScreen.hide();

      if (__DEV__) {
        this.loadNavigationState = routes.loadNavigationState;
        this.persistNavigationState = routes.persistNavigationState;
      }
    }

    return (
      <ColorSchemeProvider mode={session.mode || undefined}>
        <ColorSchemeContext.Consumer>{this.renderRoot}</ColorSchemeContext.Consumer>
      </ColorSchemeProvider>
    );
  }

  renderRoot = mode => {
    const { RootStack, loadNavigationState, persistNavigationState } = this;
    const isDark = mode === 'dark';

    const barStyle = isDark ? 'light-content' : 'dark-content';
    const backgroundColor = isDark ? dark.Background : color.Background;

    if (this.style.backgroundColor !== backgroundColor) {
      this.style = { flex: 1, backgroundColor };
      changeNavigationBarColor(backgroundColor, !isDark, false);
    }

    return (
      <View style={this.style}>
        <StatusBar backgroundColor={backgroundColor} barStyle={barStyle} />
        <RootStack
          ref={navigation.setRef}
          loadNavigationState={loadNavigationState}
          persistNavigationState={persistNavigationState}
        />
      </View>
    );
  };

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }
}

export default App;
