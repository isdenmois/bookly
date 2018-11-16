import { StackNavigatorConfig, NavigationRouteConfigMap } from 'react-navigation'

import { HomeScreen } from 'views/home/HomeScreen'
import { BookScreen } from 'views/book/BookScreen'
import { ProfileScreen } from 'views/profile/ProfileScreen'
import { BooksSearchScreen } from 'views/books-search/BooksSearchScreen'

export const MainStack: NavigationRouteConfigMap = {
  Home: HomeScreen,
  Book: BookScreen,
  Profile: ProfileScreen,
  BooksSearch: BooksSearchScreen,
}

export const MainStackOptions: StackNavigatorConfig = {
  initialRouteName: 'Home',
}
