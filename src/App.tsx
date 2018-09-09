import * as React from 'react';
import { Font } from 'expo';
import { Provider } from 'mobx-react';
import { ActivityIndicator } from 'react-native';
import { loadSessionId } from './modules/api/api';
import { RootStack } from './states/main';
import { BookStore } from './views/book/BookStore';
import { LoginStore } from './views/login/LoginStore';

const store = {
  bookStore: new BookStore(),
  loginStore: new LoginStore(),
};

interface State {
    isLoaded: boolean;
}

export default class App extends React.Component {
    state: State = {
        isLoaded: false,
    };

    componentWillMount() {
        const font = Font.loadAsync({
                'Roboto': require('native-base/Fonts/Roboto.ttf'),
                'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
              }),
              session = loadSessionId();

        Promise.all([font, session])
            .catch(() => true)
            .then(() => this.setState({isLoaded: true}));
    }

    render() {
        if (!this.state.isLoaded) {
            return <ActivityIndicator/>;
        }

        return (
            <Provider {...store}>
              <RootStack/>
            </Provider>
        );
      }
}
