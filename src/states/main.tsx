import { createStackNavigator } from 'react-navigation';

import { HomeScreen } from '../views/home/HomeScreen';
import { BookScreen } from '../views/book/BookScreen';
import { LoginScreen } from '../views/login/LoginScreen';

export const RootStack = createStackNavigator(
    {
        Login: LoginScreen,
        Home: HomeScreen,
        Book: BookScreen,
    },
    {
        initialRouteName: 'Login',
    },
);
