import React from 'react';
import { inject, InjectorContext, provider, toValue } from 'react-ioc';
import { ActivityIndicator } from 'react-native';
import { Database } from '@nozbe/watermelondb';
import { database } from 'store';
import { Session, SyncService, Storage } from 'services';
import { Routes } from '../router/routes-web';
import { providers } from '../providers';

const injections: any[] = [...providers, Storage, [Database, toValue(database)]];

@provider(...injections)
class App extends React.Component {
  static contextType = InjectorContext;

  session = inject(this, Session);
  syncService = inject(this, SyncService);
  state = { isLoaded: false };

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

    return <Routes />;
  }
}

function addFont(font, family) {
  // Generate required css
  const iconFontStyles = `@font-face {
    src: url(${font});
    font-family: ${family};
  }`;

  // Create stylesheet
  const style = document.createElement('style') as any;
  style.type = 'text/css';
  if (style.styleSheet) {
    style.styleSheet.cssText = iconFontStyles;
  } else {
    style.appendChild(document.createTextNode(iconFontStyles));
  }

  // Inject stylesheet
  document.head.appendChild(style);
}

addFont(require('react-native-vector-icons/Fonts/FontAwesome5_Solid.ttf'), 'FontAwesome5_Solid');
addFont(require('react-native-vector-icons/Fonts/FontAwesome5_Regular.ttf'), 'FontAwesome5_Regular');

let Root = App;

if (__DEV__) {
  const { hot } = require('react-hot-loader/root');

  Root = hot(App);
  Root.contextType = InjectorContext;
}

export default Root;
