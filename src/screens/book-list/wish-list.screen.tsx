import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { ReadListScreen } from './read-list.screen';
import { createQueryState } from './book-list.service';

const defaultFilters = {
  status: BOOK_STATUSES.WISH,
};

const WISH_LIST_FILTERS = ['title', 'author', 'type'];

const WISH_LIST_SORTS = ['title', 'author', 'id'];

export class WishListScreen extends ReadListScreen {
  state = createQueryState(defaultFilters, { field: 'title', desc: false });

  filters = WISH_LIST_FILTERS;
  sorts = WISH_LIST_SORTS;
  title = 'Хочу прочитать';
}
