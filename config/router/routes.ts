import { HomeScreen } from 'screens/home/home.screen';
import { SearchScreen } from 'screens/search/search.screen';
import { ReadListScreen } from 'screens/book-list/read-list.screen';
import { WishListScreen } from 'screens/book-list/wish-list.screen';
import { ProfileScreen } from 'screens/profile/profile.screen';
import { DetailsScreen } from 'screens/details/details.screen';

import { ChangeStatusModal } from 'modals/change-status/change-status.modal';
import { BookSelectModal } from 'modals/book-select/book-select.modal';
import { BookFiltersModal } from 'modals/book-filters/book-filters.modal';
import { ThumbnailSelectModal } from 'modals/thumbnail-select/thumbnail-select.modal';

export const MainStack = {
  Home: HomeScreen,
  Search: SearchScreen,
  ReadList: ReadListScreen,
  WishList: WishListScreen,
  Profile: ProfileScreen,
  Details: DetailsScreen,
};

export const ModalStack = {
  ChangeStatus: ChangeStatusModal,
  BookSelect: BookSelectModal,
  BookFilters: BookFiltersModal,
  ThumbnailSelect: ThumbnailSelectModal,
};
