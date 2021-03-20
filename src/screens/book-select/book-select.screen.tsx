import React, { Component } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Where } from '@nozbe/watermelondb/QueryDescription';

import { Screen } from 'components';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { BookSort, BookFilters } from 'types/book-filters';
import { createQueryState } from 'screens/book-list/book-list.service';
import { BookListFilters } from 'screens/book-list/components/book-list-filters';
import { MainRoutes, MainScreenProps, ModalRoutes } from 'navigation/routes';
import { openModal } from 'services';
import { headerRightButton } from 'components/screen-header';
import { BookSelector } from './book-selector';

type Props = MainScreenProps<MainRoutes.BookSelect>;

const defaultFilters = {
  status: BOOK_STATUSES.WISH,
};

interface State {
  query: Where[];
  sort: BookSort;
  filters: Partial<BookFilters>;
}

const FILTERS_FIELDS = ['type', 'author', 'paper', 'list'];

export class BookSelectScreen extends Component<Props> {
  state: State = createQueryState(defaultFilters, { field: 'date', desc: true });

  componentDidMount() {
    this.props.navigation.setOptions({
      headerRight: headerRightButton('sliders-h', this.openFilters),
    });
  }

  render() {
    return (
      <Screen>
        <View style={s.filters}>
          <BookListFilters filters={this.state.filters} onChange={this.setFilters} />
        </View>

        <BookSelector query={this.state.query} openFilters={this.openFilters} />
      </Screen>
    );
  }

  setFilters = filters => this.setState(createQueryState(filters, this.state.sort));

  openFilters = () =>
    openModal(ModalRoutes.BookFilters, {
      setFilters: this.setFilters,
      filterFields: FILTERS_FIELDS,
      filters: this.state.filters,
    });
}

const s = StyleSheet.create({
  filters: {
    marginTop: 20,
    paddingHorizontal: 20,
  } as ViewStyle,
});
