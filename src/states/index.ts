import { createStackNavigator, createSwitchNavigator } from 'react-navigation'

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
        mode: 'card',
        headerMode: 'none',
        cardStyle: {
          backgroundColor: 'transparent',
          opacity: 1,
        },
        // TODO: добавить transitionConfig
      },
    ),
  },
  {
    initialRouteName: 'Login',
  },
)
