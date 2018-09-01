import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import { HomeScreen } from '../views/home/HomeScreen';
import { BookScreen } from '../views/book/BookScreen';

export const RootStack = createMaterialBottomTabNavigator(
    {
        Home: HomeScreen,
        Book: BookScreen,
    },
    {
        initialRouteName: 'Home',
        barStyle: { backgroundColor: '#3068ad' },
    },
);
