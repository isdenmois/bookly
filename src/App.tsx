import * as React from 'react';
import { Font } from 'expo';
import { Provider } from 'mobx-react';
import { RootStack } from './states/main';
import { BookStore } from './views/book/BookStore';

const navigationPersistenceKey = __DEV__ ? 'NavigationStateDEV' : null;

const store = {
  bookStore: new BookStore(),
};

export default class App extends React.Component {
    async componentWillMount() {
        await Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        });
    }

    render() {
    return (
        <Provider {...store}>
          <RootStack persistenceKey={navigationPersistenceKey}/>
        </Provider>
    );
  }
}
