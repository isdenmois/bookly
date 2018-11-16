import { createStackNavigator, createSwitchNavigator } from 'react-navigation'

import { LoginScreen } from 'views/login/LoginScreen'
import { MainStack, MainStackOptions } from './main'
import { ModalStack, ModalStackOptions } from './modal'

export const RootStack = createSwitchNavigator(
  {
    Login: LoginScreen,
    App: createStackNavigator(
      {
        MainStack: createStackNavigator(MainStack, MainStackOptions),
        ModalStack: createStackNavigator(ModalStack, ModalStackOptions),
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
