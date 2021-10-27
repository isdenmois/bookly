import React, { FC } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Platform } from 'react-native';

import { setNavigation } from 'services/navigation';
import { MainRoutes, MainScreenProps } from 'navigation/routes';

import { MainScreen } from './screens/main.screen';
import { BookshelvesScreen } from './screens/bookshelves.screen';
import { HomeSearchScreen } from './screens/search.screen';
import { ProfileScreen } from './screens/profile.screen';

const Tab = createBottomTabNavigator();

type Props = MainScreenProps<MainRoutes.Home>;

export const HomeScreen: FC<Props> = ({ navigation }) => {
  setNavigation(navigation);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarShowLabel: false, tabBarStyle }}>
      <Tab.Screen name='main' component={MainScreen} options={{ tabBarIcon: icon('home'), tabBarTestID: 'homeTab' }} />
      <Tab.Screen
        name='bookshelves'
        component={BookshelvesScreen}
        options={{ tabBarIcon: icon('book'), tabBarTestID: 'shelvesTab' }}
      />
      <Tab.Screen
        name='home-search'
        component={HomeSearchScreen}
        options={{ tabBarIcon: icon('search'), unmountOnBlur: true, tabBarTestID: 'searchTab' }}
      />
      <Tab.Screen name='profile' component={ProfileScreen} options={{ tabBarIcon: icon('user') }} />
    </Tab.Navigator>
  );
};

const icon =
  name =>
  ({ color, size }) =>
    <Icon name={name} color={color} size={size} />;

const tabBarStyle = Platform.OS === 'web' ? { marginBottom: 24 } : null;
