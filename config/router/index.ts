import _ from 'lodash';
import { createSwitchNavigator } from 'react-navigation';
import { createStackNavigator, TransitionPresets } from 'react-navigation-stack';
import { Easing } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { enableScreens } from 'react-native-screens';

import { LoginScreen } from 'screens/login/login.screen';
import { createApp } from './create-app';
import { MainStack, ModalStack } from './routes';

const createNavigator = (initialRouteName) =>
  createSwitchNavigator(
    {
      Login: {
        screen: LoginScreen,
        path: '/login',
      },
      App: createStackNavigator(
        {
          MainStack: createStackNavigator(MainStack, {
            initialRouteName: 'Home',
            headerMode: 'none',
            gestureEnabled: true,
            defaultNavigationOptions: {
              ...TransitionPresets.SlideFromRightIOS,
              gestureEnabled: true,
              cardStyle: { backgroundColor: 'white' },
            },
          } as any),
          ...createModalStack(ModalStack),
        },
        {
          initialRouteName: 'MainStack',
          mode: 'modal',
          headerMode: 'none',
          defaultNavigationOptions: {
            cardStyleInterpolator({ current, closing }) {
              return {
                cardStyle: {
                  opacity: current.progress,
                },
              };
            },
            transitionSpec: {
              open: modalConfig,
              close: modalConfig,
            },
            cardStyle: { backgroundColor: 'transparent' },
          },
        } as any,
      ),
    },
    {
      initialRouteName,
    },
  );

const PERSISTENCE_KEY = 'REACT_DEV_NAVIGATION';

export const persistNavigationState = async (nav) => {
  if (!hasModals(nav)) {
    await AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(nav));
  }
};

export const loadNavigationState = async () => {
  const jsonString = await AsyncStorage.getItem(PERSISTENCE_KEY);
  return JSON.parse(jsonString);
};

export const create = (route) => {
  enableScreens(true);
  return createApp(createNavigator(route));
};

const modalConfig = {
  animation: 'timing',
  config: {
    duration: 100,
    easing: Easing.out(Easing.poly(4)),
  },
};

function isRouteModal(scene) {
  return scene && scene.routeName.startsWith('/modal');
}

function hasModals(nav) {
  if (_.get(nav, 'routes[1].routeName') !== 'App') return false;

  return _.some(nav.routes[1].routes, isRouteModal);
}

function createModalStack(stack) {
  const result = {};

  _.forEach(stack, (screen, key) => {
    result[`/modal/${_.kebabCase(key)}`] = screen;
  });

  return result;
}
