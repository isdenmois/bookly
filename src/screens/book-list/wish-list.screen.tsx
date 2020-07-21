import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { session } from 'services';
import { withScroll } from 'utils/scroll-to-top';
import { ReadList } from './read-list.screen';
import { createQueryState } from './book-list.service';

const defaultFilters = {
  status: BOOK_STATUSES.WISH,
};

const WISH_LIST_FILTERS = ['title', 'author', 'type', 'paper', 'isLiveLib'];

export const WISH_LIST_SORTS = ['title', 'author', 'id', 'createdAt'];

@withScroll
export class WishListScreen extends ReadList {
  state = createQueryState(
    {
      ...defaultFilters,
      status: BOOK_STATUSES.WISH,
      ...(session.paper ? {} : { paper: 'e' }),
    },
    session.defaultSort,
  );

  showTopRate = null;
  filters = WISH_LIST_FILTERS;
  sorts = WISH_LIST_SORTS;
  title = 'nav.wish';
}
