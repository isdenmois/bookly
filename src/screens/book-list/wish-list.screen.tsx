import { InjectorContext } from 'react-ioc';
import { BOOK_STATUSES } from 'enums/book-statuses.enum';
import { ReadListScreen } from './read-list.screen';
import { createQueryState } from './book-list.service';

const defaultFilters = {
  status: BOOK_STATUSES.WISH,
};

const WISH_LIST_FILTERS = ['author', 'type'];

const WISH_LIST_SORTS = ['date', 'title', 'author', 'id'];

export class WishListScreen extends ReadListScreen {
  static contextType = InjectorContext;

  state = createQueryState(defaultFilters, { field: 'date', desc: true });

  filters = WISH_LIST_FILTERS;
  sorts = WISH_LIST_SORTS;
  title = 'Хочу прочитать';
}
