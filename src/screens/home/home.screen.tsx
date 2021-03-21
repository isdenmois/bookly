import React, { FC } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { setNavigation } from 'services/navigation';
import { MainRoutes, MainScreenProps } from 'navigation/routes';

import { MainScreen } from './screens/main.screen';
import { BookshelvesScreen } from './screens/bookshelves.screen';
import { HomeSearchScreen } from './screens/search.screen';
import { ProfileScreen } from './screens/profile.screen';
import { Platform } from 'react-native';

const Tab = createBottomTabNavigator();

type Props = MainScreenProps<MainRoutes.Home>;

export const HomeScreen: FC<Props> = ({ navigation }) => {
  setNavigation(navigation);

  return (
    <Tab.Navigator tabBarOptions={{ showLabel: false, safeAreaInsets: Platform.OS === 'web' ? { bottom: 24 } : null }}>
      <Tab.Screen name='main' component={MainScreen} options={{ tabBarIcon: icon('home') }} />
      <Tab.Screen name='bookshelves' component={BookshelvesScreen} options={{ tabBarIcon: icon('book') }} />
      <Tab.Screen
        name='home-search'
        component={HomeSearchScreen}
        options={{ tabBarIcon: icon('search'), unmountOnBlur: true }}
      />
      <Tab.Screen name='profile' component={ProfileScreen} options={{ tabBarIcon: icon('user') }} />
    </Tab.Navigator>
  );
};

const icon = name => ({ color, size }) => <Icon name={name} color={color} size={size} />;
