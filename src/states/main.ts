import { createStackNavigator, createSwitchNavigator } from 'react-navigation'

import { HomeScreen } from 'views/home/HomeScreen'
import { BookScreen } from 'views/book/BookScreen'
import { LoginScreen } from 'views/login/LoginScreen'
import { ProfileScreen } from 'views/profile/ProfileScreen'
import { BooksSearchScreen } from 'views/books-search/BooksSearchScreen'

export const AppStack = createStackNavigator(
  {
    Home: HomeScreen,
    Book: BookScreen,
    Profile: ProfileScreen,
    BooksSearch: BooksSearchScreen,
  },
  {
    initialRouteName: 'Home',
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
