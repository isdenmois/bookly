import { createStackNavigator, createSwitchNavigator } from 'react-navigation'

import { HomeScreen } from 'views/home/HomeScreen'
import { BookScreen } from 'views/book/BookScreen'
import { LoginScreen } from 'views/login/LoginScreen'
import { ProfileScreen } from 'views/profile/ProfileScreen'
import { BooksSearchScreen } from 'views/books-search/BooksSearchScreen'

export const ModalStack = {
}

export const AppStack = createStackNavigator(
  {
    Home: HomeScreen,
    Book: BookScreen,
    Profile: ProfileScreen,
    BooksSearch: BooksSearchScreen,
    ...ModalStack,
  },
  {
    initialRouteName: 'Home',
    mode: 'card',
    cardStyle: {
      backgroundColor: 'transparent',
      opacity: 1,
    },
  },
)

export const RootStack = createSwitchNavigator(
  {
    Login: LoginScreen,
    App: AppStack,
  },
  {
    initialRouteName: 'Login',
  },
)
