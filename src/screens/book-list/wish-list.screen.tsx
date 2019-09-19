import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { Session, inject } from 'services';
import { ReadListScreen } from './read-list.screen';
import { createQueryState } from './book-list.service';

const defaultFilters = {
  status: BOOK_STATUSES.WISH,
};

const WISH_LIST_FILTERS = ['title', 'author', 'type', 'isLiveLib'];

export const WISH_LIST_SORTS = ['title', 'author', 'id', 'createdAt'];

export class WishListScreen extends ReadListScreen {
  session = inject(Session);

  state = createQueryState(defaultFilters, this.session.defaultSort);
  // state = createQueryState(defaultFilters, { field: 'title', desc: false });

  filters = WISH_LIST_FILTERS;
  sorts = WISH_LIST_SORTS;
  title = 'Хочу прочитать';
}
