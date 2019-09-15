import React, { Component } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { ScreenHeader } from 'components';
import { color } from 'types/colors';
import { BookSelector } from './book-selector';
import { inject } from 'services';
import { Database } from '@nozbe/watermelondb';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { Where } from '@nozbe/watermelondb/QueryDescription';
import { BookSort, BookFilters } from 'types/book-filters';
import { createQueryState } from 'screens/book-list/book-list.service';

interface Props {}

const defaultFilters = {
  status: BOOK_STATUSES.WISH,
};

interface State {
  query: Where[];
  sort: BookSort;
  filters: Partial<BookFilters>;
}

// const FILTERS = ['type', 'author'];

export class BookSelectScreen extends Component<Props> {
  state: State = createQueryState(defaultFilters, { field: 'date', desc: true });
  database = inject(Database);

  render() {
    return (
      <View style={s.container}>
        <ScreenHeader title='Выбор книги' />
        <BookSelector database={this.database} query={this.state.query} />
      </View>
    );
  }
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.Background,
  } as ViewStyle,
});
