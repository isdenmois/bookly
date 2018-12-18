import { StackNavigatorConfig, NavigationRouteConfigMap } from 'react-navigation'

import { HomeScreen } from 'views/home/home.screen'
import { ProfileScreen } from 'views/profile/profile-screen'
import { BooksSearchScreen } from 'views/books-search/books-search.screen'
import { WishListScreen } from 'views/book-list/wish-list.screen'
import { HaveReadListScreen } from 'views/book-list/have-read-list.screen'

export const MainStack: NavigationRouteConfigMap = {
  Home: HomeScreen,
  Profile: ProfileScreen,
  BooksSearch: BooksSearchScreen,
  WishList: WishListScreen,
  HaveReadList: HaveReadListScreen
}

export const MainStackOptions: StackNavigatorConfig = {
  initialRouteName: 'Home',
}
