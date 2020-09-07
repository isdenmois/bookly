import _ from 'lodash';
import { createSwitchNavigator } from 'react-navigation';
import { createStackNavigator, TransitionPresets } from 'react-navigation-stack';
import { Easing, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { enableScreens } from 'react-native-screens';

import { LoginScreen } from 'screens/login/login.screen';
import { createApp, createStackPersistNavigator } from './create-app';
import { MainStack, ModalStack } from './routes';

const createNavigator = initialRouteName =>
  createSwitchNavigator(
    {
      Login: {
        screen: LoginScreen,
        path: '/login',
      },
      App: {
        screen: createStackNavigator(
          {
            MainStack: {
              screen: createStackPersistNavigator(MainStack, {
                initialRouteName: 'Home',
                headerMode: 'none',
                gestureEnabled: true,
                defaultNavigationOptions: {
                  ...TransitionPresets.SlideFromRightIOS,
                  gestureEnabled: true,
                  cardStyle: { backgroundColor: null },
                  cardOverlayEnabled: false,
                  cardShadowEnabled: false,
                },
              } as any),
              path: '',
            },
            ...createModalStack(ModalStack),
          },
          {
            initialRouteName: 'MainStack',
            mode: 'modal',
            headerMode: 'none',
            gestureEnabled: false,
            defaultNavigationOptions: {
              gestureEnabled: false,
              cardStyleInterpolator({ current }) {
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
              cardStyle: { backgroundColor: null },
              cardOverlayEnabled: false,
              cardShadowEnabled: false,
            },
          } as any,
        ),
        path: '',
      },
    },
    {
      initialRouteName,
    },
  );

const PERSISTENCE_KEY = 'REACT_DEV_NAVIGATION';

export const persistNavigationState = async nav => {
  if (!hasModals(nav)) {
    await AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(nav));
  }
};

export const loadNavigationState = async () => {
  const jsonString = await AsyncStorage.getItem(PERSISTENCE_KEY);
  return JSON.parse(jsonString);
};

export const create = route => {
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
