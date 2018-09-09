import { createStackNavigator } from 'react-navigation';

import { HomeScreen } from '../views/home/HomeScreen';
import { BookScreen } from '../views/book/BookScreen';

export const RootStack = createStackNavigator(
    {
        Home: HomeScreen,
        Book: BookScreen,
    },
    {
        initialRouteName: 'Home',
    },
);
