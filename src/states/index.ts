import { createStackNavigator, createSwitchNavigator } from 'react-navigation'
import { Easing, Animated } from 'react-native'

import { LoginScreen } from 'views/login/login.screen'
import { MainStack, MainStackOptions } from './main'
import { ModalStack } from './modal'

export const RootStack = createSwitchNavigator(
  {
    Login: LoginScreen,
    App: createStackNavigator(
      {
        MainStack: createStackNavigator(MainStack, MainStackOptions),
        ...ModalStack,
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
    initialRouteName: 'Login',
  },
)

function transitionConfig() {
  return {
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

      return {opacity};
    },
  }
}
