import * as React from 'react';
import { Provider } from 'mobx-react';
import { RootStack } from './states/main';
import { BookStore } from './views/book/BookStore';

const navigationPersistenceKey = __DEV__ ? 'NavigationStateDEV' : null;

const store = {
  bookStore: new BookStore(),
};

export default class App extends React.Component {
  render() {
    return (
        <Provider {...store}>
          <RootStack persistenceKey={navigationPersistenceKey}/>
        </Provider>
    );
  }
}
