import React from 'react';
import { observer } from 'mobx-react';
import { Session, inject } from 'services';
import { BookListSort as BookListSortListItem } from 'modals/book-filters/components/book-list-sort';
import { WISH_LIST_SORTS } from 'screens/book-list/wish-list.screen';

@observer
export class BookListSort extends React.Component {
  session = inject(Session);

  render() {
    return (
      <BookListSortListItem
        title='Сортировка по-умолчанию'
        fields={WISH_LIST_SORTS}
        value={this.session.defaultSort}
        onChange={this.setDefaultSort}
      />
    );
  }

  setDefaultSort = sort => this.session.setDefaultSort(sort);
}
