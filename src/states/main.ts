import { StackNavigatorConfig, NavigationRouteConfigMap } from 'react-navigation'

import { HomeScreen } from 'views/home/home.screen'
import { ProfileScreen } from 'views/profile/profile-screen'
import { BooksSearchScreen } from 'views/books-search/books-search.screen'
import { WishListScreen } from 'views/book-list/wish-list.screen'

export const MainStack: NavigationRouteConfigMap = {
  Home: HomeScreen,
  Profile: ProfileScreen,
  BooksSearch: BooksSearchScreen,
  WishList: WishListScreen,
}

export const MainStackOptions: StackNavigatorConfig = {
  initialRouteName: 'Home',
}
