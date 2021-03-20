import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { settings } from 'services';
import { withScroll } from 'utils/scroll-to-top';
import { ReadList } from './read-list.screen';
import { createQueryState } from './book-list.service';

const defaultFilters = {
  status: BOOK_STATUSES.WISH,
};

const WISH_LIST_FILTERS = ['title', 'author', 'type', 'paper', 'isLiveLib', 'list'];

export const WISH_LIST_SORTS = ['title', 'author', 'id', 'createdAt'];

@withScroll
export class WishListScreen extends ReadList {
  // TODO: initial filters
  state = createQueryState(
    {
      ...defaultFilters,
      status: BOOK_STATUSES.WISH,
      ...this.getFilters(),
    },
    settings.defaultSort,
  );

  showTopRate = null;
  showListBookSelect = true;
  filters = WISH_LIST_FILTERS;
  sorts = WISH_LIST_SORTS;
  title = 'nav.wish';

  getFilters() {
    const filters: any = {};
    const listId = this.props.route.params?.listId;

    if (listId) {
      filters.list = {
        id: listId,
        name: this.props.route.params?.listName,
      };
    }

    return filters;
  }
}
