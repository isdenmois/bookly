import _ from 'lodash';
import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { Easing, Animated } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { HomeScreen } from 'screens/home/home.screen';
import { LoginScreen } from 'screens/login/login.screen';
import { SearchScreen } from 'screens/search/search.screen';
import { ReadListScreen } from 'screens/book-list/read-list.screen';
import { WishListScreen } from 'screens/book-list/wish-list.screen';
import { ProfileScreen } from 'screens/profile/profile.screen';

import { ChangeStatusModal } from 'modals/change-status/change-status.modal';
import { BookSelectModal } from 'modals/book-select/book-select.modal';
import { BookFiltersModal } from 'modals/book-filters/book-filters.modal';

const MainStack = {
  Home: HomeScreen,
  Search: SearchScreen,
  ReadList: ReadListScreen,
  WishList: WishListScreen,
  Profile: ProfileScreen,
};

const ModalStack = {
  ChangeStatus: ChangeStatusModal,
  BookSelect: BookSelectModal,
  BookFilters: BookFiltersModal,
};

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

export const create = route => {
  const Component: any = createAppContainer(createNavigator(route));

  class PathcedComponent extends Component {
    _persistNavigationState = async nav => {
      const { persistenceKey } = this.props;

      if (!persistenceKey || hasModals(nav)) {
        return;
      }

      await AsyncStorage.setItem(persistenceKey, JSON.stringify(nav));
    };
  }

  return PathcedComponent;
};

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
