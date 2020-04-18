import React from 'react';
import { observer } from 'mobx-react';
import { session } from 'services';
import { BookListSort as BookListSortListItem } from 'modals/book-filters/components/book-list-sort';
import { WISH_LIST_SORTS } from 'screens/book-list/wish-list.screen';

@observer
export class BookListSort extends React.Component {
  render() {
    return (
      <BookListSortListItem
        title='Сортировка по-умолчанию'
        fields={WISH_LIST_SORTS}
        value={session.defaultSort}
        onChange={this.setSort}
      />
    );
  }

  setSort = sort => session.set('defaultSort', sort);
}
