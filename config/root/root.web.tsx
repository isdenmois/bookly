import React from 'react';
import { ActivityIndicator, StatusBar, View, ViewStyle } from 'react-native';
import { observer } from 'mobx-react';
import AsyncStorage from '@react-native-community/async-storage';
import { ColorSchemeProvider, ColorSchemeContext } from 'react-native-dynamic';
import 'mobx-react-lite/batchingForReactDom';
import { onChanges } from 'store';
import { i18n } from 'services/i18n';

import { session, syncService, navigation } from 'services';
import { dark, color } from 'types/colors';
import { create } from '../router';

@observer
class App extends React.Component<any> {
  state = { isLoaded: false };
  stack: any = null;
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

    if (!this.stack) {
      this.stack = create(session.userId ? 'App' : 'Login');
    }

    return (
      <ColorSchemeProvider mode={session.mode || undefined}>
        <ColorSchemeContext.Consumer>{this.renderRoot}</ColorSchemeContext.Consumer>
      </ColorSchemeProvider>
    );
  }

  renderRoot = mode => {
    const RootStack = this.stack;
    const isDark = mode === 'dark';

    const barStyle = isDark ? 'light-content' : 'dark-content';
    const backgroundColor = isDark ? dark.Background : color.Background;

    if (this.style.backgroundColor !== backgroundColor) {
      this.style = { flex: 1, backgroundColor };
    }

    return (
      <View style={this.style}>
        <StatusBar backgroundColor={backgroundColor} barStyle={barStyle} />
        <RootStack ref={navigation.setRef} />
      </View>
    );
  };

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }
}

export default App;
