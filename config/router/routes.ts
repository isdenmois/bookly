import { HomeScreen } from 'screens/home/home.screen';
import { SearchScreen } from 'screens/search/search.screen';
import { ReadListScreen } from 'screens/book-list/read-list.screen';
import { WishListScreen } from 'screens/book-list/wish-list.screen';
import { ProfileScreen } from 'screens/profile/profile.screen';
import { DetailsScreen } from 'screens/details/details.screen';
import { EditionsListScreen } from 'screens/editions/editions.screen';
import { BookSelectScreen } from 'screens/book-select/book-select.screen';
import { StatScreen } from 'screens/stat/stat.screen';

import { ChangeStatusModal } from 'modals/change-status/change-status.modal';
import { BookSelectModal } from 'modals/book-select/book-select.modal';
import { BookFiltersModal } from 'modals/book-filters/book-filters.modal';
import { ThumbnailSelectModal } from 'modals/thumbnail-select/thumbnail-select.modal';
import { ReviewWriteModal } from 'modals/review-write/review-write.modal';
import { FantlabLoginModal } from 'modals/fantlab-login/fantlab-login.modal';
import { BookTitleEditModal } from 'modals/book-title-edit/book-title-edit.modal';
import { ScanAddressModal } from 'modals/scan-address/scan-address.modal';

export const MainStack = {
  Home: HomeScreen,
  Search: SearchScreen,
  ReadList: ReadListScreen,
  WishList: WishListScreen,
  Profile: ProfileScreen,
  Details: DetailsScreen,
  Editions: EditionsListScreen,
  BookSelect: BookSelectScreen,
  Stat: StatScreen,
};

export const ModalStack = {
  ChangeStatus: ChangeStatusModal,
  BookSelect: BookSelectModal,
  BookFilters: BookFiltersModal,
  ThumbnailSelect: ThumbnailSelectModal,
  ReviewWrite: ReviewWriteModal,
  FantlabLogin: FantlabLoginModal,
  BookTitleEdit: BookTitleEditModal,
  ScanAddress: ScanAddressModal,
};
