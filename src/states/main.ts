import { StackNavigatorConfig, NavigationRouteConfigMap } from 'react-navigation'

import { HomeScreen } from 'views/home/home.screen'
import { BookScreen } from 'views/book/book.screen'
import { ProfileScreen } from 'views/profile/profile-screen'
import { BooksSearchScreen } from 'views/books-search/books-search.screen'

export const MainStack: NavigationRouteConfigMap = {
  Home: HomeScreen,
  Book: BookScreen,
  Profile: ProfileScreen,
  BooksSearch: BooksSearchScreen,
}

export const MainStackOptions: StackNavigatorConfig = {
  initialRouteName: 'Home',
}
