import { useNavigation } from '@react-navigation/core';
import { NavigatorScreenParams } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import Book, { BookData } from 'store/book';
import List from 'store/list';
import Review from 'store/review';
import { BookExtended, EditionTranslators } from 'types/book-extended';
import { BookFilters, BookSort } from 'types/book-filters';
import { BOOK_STATUSES } from 'types/book-statuses.enum';

export enum RootRoutes {
  Main = 'main',
  Modal = 'modal',
}

type RootParamList = {
  [RootRoutes.Main]: NavigatorScreenParams<MainParamList>;
  [RootRoutes.Modal]: NavigatorScreenParams<ModalParamList>;
};

export enum MainRoutes {
  Home = 'home',
  Search = 'search',
  ReadList = 'read-list',
  WishList = 'wish-list',
  Details = 'details',
  Editions = 'editions',
  BookSelect = 'book-select',
  Stat = 'stat',
  WorkList = 'work-list',
  TopRate = 'top-rate',
  Authors = 'authors',
  AuthorSearch = 'author-search',
  Settings = 'settings',
  Lists = 'lists',
}

type MainParamList = {
  [MainRoutes.Home]: null;
  [MainRoutes.Search]: { query: string; source?: string; forceOpen?: boolean; fantlabId?: string; paper?: boolean };
  [MainRoutes.ReadList]: { filters?; sort?; readonly?: boolean; listId?: string; listName?: string };
  [MainRoutes.WishList]: null;
  [MainRoutes.Details]: { bookId: string; extra?: Partial<BookData>; fantlabId?: string; initialTab?: string };
  [MainRoutes.Editions]: { editionIds: number[]; translators: EditionTranslators };
  [MainRoutes.BookSelect]: null;
  [MainRoutes.Stat]: null;
  [MainRoutes.WorkList]: { title: string; works: any[] };
  [MainRoutes.TopRate]: { books: any[] };
  [MainRoutes.Authors]: null;
  [MainRoutes.AuthorSearch]: { query: string };
  [MainRoutes.Settings]: null;
  [MainRoutes.Lists]: null;
};

export type MainScreenProps<RouteName extends MainRoutes> = StackScreenProps<MainParamList, RouteName>;
export type MainNavigationProp<RouteName extends MainRoutes> = StackNavigationProp<MainParamList, RouteName>;

export enum ModalRoutes {
  ChangeStatus = 'change-status',
  BookSelect = 'book-select',
  BookFilters = 'book-filters',
  ThumbnailSelect = 'thumbnail-select',
  ReviewWrite = 'review-write',
  FantlabLogin = 'fantlab-login',
  BookTitleEdit = 'book-title-edit',
  ScanIsbn = 'scan-isbn',
  ListAdd = 'list-add',
  ListEdit = 'list-edit',
  ListBookSelect = 'list-book-select',
  BookActions = 'book-actions',
  BookEditor = 'book-editor',
}

export type ModalParamList = {
  [ModalRoutes.ChangeStatus]: { book: Book; status?: BOOK_STATUSES };
  [ModalRoutes.BookSelect]: null;
  [ModalRoutes.BookFilters]: {
    filterFields: Array<keyof BookFilters>;
    filters: Partial<BookFilters>;
    setFilters: (filters: Partial<BookFilters>, sort: BookSort) => void;
    sort?: BookSort;
    sortFields?: string[];
  };
  [ModalRoutes.ThumbnailSelect]: { book: Book & BookExtended };
  [ModalRoutes.ReviewWrite]: { book: Book; review?: Review };
  [ModalRoutes.FantlabLogin]: { onSuccess(); onClose() };
  [ModalRoutes.BookTitleEdit]: { book: Book & BookExtended };
  [ModalRoutes.ScanIsbn]: { onScan(query: string) };
  [ModalRoutes.ListAdd]: null;
  [ModalRoutes.ListEdit]: { list: List };
  [ModalRoutes.ListBookSelect]: { listId: string };
  [ModalRoutes.BookActions]: { bookId: string };
  [ModalRoutes.BookEditor]: { bookId: string };
};

export type ModalScreenProps<RouteName extends ModalRoutes> = StackScreenProps<ModalParamList, RouteName>;
export type ModalNavigationProp<RouteName extends ModalRoutes> = StackNavigationProp<ModalParamList, RouteName>;

export type ScreenProps = StackScreenProps<RootParamList, RootRoutes.Main>;
export type ScreenNavigation = StackNavigationProp<RootParamList, RootRoutes.Main>;

export const useNav = () => useNavigation<StackNavigationProp<RootParamList, RootRoutes.Main>>();
