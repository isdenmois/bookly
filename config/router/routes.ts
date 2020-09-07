import { HomeScreen } from 'screens/home/home.screen';
import { SearchScreen } from 'screens/search/search.screen';
import { ReadListScreen } from 'screens/book-list/read-list.screen';
import { WishListScreen } from 'screens/book-list/wish-list.screen';
import { ProfileScreen } from 'screens/profile/profile.screen';
import { DetailsScreen } from 'screens/details/details.screen';
import { EditionsListScreen } from 'screens/editions/editions.screen';
import { BookSelectScreen } from 'screens/book-select/book-select.screen';
import { StatScreen } from 'screens/stat/stat.screen';
import { WorkListScreen } from 'screens/work-list/work-list.screen';
import { TopRateScreen } from 'screens/top-rate/top-rate.screen';
import { AuthorsScreen } from 'screens/authors/authors.screen';
import { AuthorSearchScreen } from 'screens/authors/author-search.screen';
import { SettingsScreen } from 'screens/settings/settings.screen';
import { ListsScreen } from 'screens/lists/lists.screen';

import { ChangeStatusModal } from 'modals/change-status/change-status.modal';
import { BookSelectModal } from 'modals/book-select/book-select.modal';
import { BookFiltersModal } from 'modals/book-filters/book-filters.modal';
import { ThumbnailSelectModal } from 'modals/thumbnail-select/thumbnail-select.modal';
import { ReviewWriteModal } from 'modals/review-write/review-write.modal';
import { FantlabLoginModal } from 'modals/fantlab-login/fantlab-login.modal';
import { BookTitleEditModal } from 'modals/book-title-edit/book-title-edit.modal';
import { ScanIsbnModal } from 'modals/scan-isbn/scan-isbn.modal';
import { ListAddModal } from 'modals/list-add.modal';
import { ListEditModal } from 'modals/list-edit.modal';
import { ListBookSelectModal } from 'modals/list-book-select.modal';

export const MainStack = {
  Home: { screen: HomeScreen, path: '' },
  Search: SearchScreen,
  ReadList: ReadListScreen,
  WishList: WishListScreen,
  Profile: ProfileScreen,
  Details: DetailsScreen,
  Editions: EditionsListScreen,
  BookSelect: BookSelectScreen,
  Stat: StatScreen,
  WorkList: WorkListScreen,
  TopRate: TopRateScreen,
  Authors: AuthorsScreen,
  AuthorSearch: AuthorSearchScreen,
  Settings: SettingsScreen,
  Lists: ListsScreen,
};

export const ModalStack = {
  ChangeStatus: ChangeStatusModal,
  BookSelect: BookSelectModal,
  BookFilters: BookFiltersModal,
  ThumbnailSelect: ThumbnailSelectModal,
  ReviewWrite: ReviewWriteModal,
  FantlabLogin: FantlabLoginModal,
  BookTitleEdit: BookTitleEditModal,
  ScanIsbn: ScanIsbnModal,
  ListAdd: ListAddModal,
  ListEdit: ListEditModal,
  ListBookSelect: ListBookSelectModal,
};
