import * as React from 'react';
import { RootStack } from './states/main';

const navigationPersistenceKey = __DEV__ ? 'NavigationStateDEV' : null;

export default class App extends React.Component {
  render() {
    return (
      <RootStack persistenceKey={navigationPersistenceKey}/>
    );
  }
}
