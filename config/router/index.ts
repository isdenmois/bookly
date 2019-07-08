import _ from 'lodash';
import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { Easing, Animated } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { LoginScreen } from 'screens/login/login.screen';
import { MainStack, ModalStack } from './routes';

const createNavigator = initialRouteName =>
  createSwitchNavigator(
    {
      Login: {
        screen: LoginScreen,
        path: '/login',
      },
      App: createStackNavigator(
        {
          MainStack: createStackNavigator(MainStack, { initialRouteName: 'Home', headerMode: 'none' }),
          ...createModalStack(ModalStack),
        },
        {
          initialRouteName: 'MainStack',
          mode: 'modal',
          headerMode: 'none',
          transparentCard: true,
          transitionConfig,
        } as any,
      ),
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

export const create = route => createAppContainer(createNavigator(route));

function isRouteModal(scene) {
  return scene && scene.routeName.startsWith('/modal');
}

function transitionConfig(next, prev, isModal) {
  isModal = isModal || (prev && isRouteModal(prev.scene));

  return isModal ? modalTransition : {};
}

function hasModals(nav) {
  if (_.get(nav, 'routes[1].routeName') !== 'App') return false;

  return _.some(nav.routes[1].routes, isRouteModal);
}

const modalTransition = {
  transitionSpec: {
    duration: 200,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing,
    useNativeDriver: true,
  },
  containerStyle: {
    backgroundColor: 'black',
  },
  screenInterpolator: sceneProps => {
    const { position, scene } = sceneProps;
    const thisSceneIndex = scene.index;

    const opacity = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [0, 1, 1],
    });

    return { opacity };
  },
};

function createModalStack(stack) {
  const result = {};

  _.forEach(stack, (screen, key) => {
    result[`/modal/${_.kebabCase(key)}`] = screen;
  });

  return result;
}
