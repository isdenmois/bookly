import React, { Component } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { ScreenHeader, Screen } from 'components';
import { color } from 'types/colors';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { Where } from '@nozbe/watermelondb/QueryDescription';
import { BookSort, BookFilters } from 'types/book-filters';
import { createQueryState } from 'screens/book-list/book-list.service';
import { NavigationStackProp } from 'react-navigation-stack';
import { t } from 'services/i18n';
import { BookSelector } from './book-selector';
import { BookListFilters } from 'screens/book-list/components/book-list-filters';

interface Props {
  navigation: NavigationStackProp;
}

const defaultFilters = {
  status: BOOK_STATUSES.WISH,
};

interface State {
  query: Where[];
  sort: BookSort;
  filters: Partial<BookFilters>;
}

const FILTERS_FIELDS = ['type', 'author', 'paper'];

export class BookSelectScreen extends Component<Props> {
  state: State = createQueryState(defaultFilters, { field: 'date', desc: true });

  render() {
    return (
      <Screen>
        <ScreenHeader title={t('headers.book-select')} right='sliders-h' onRight={this.openFilters} />

        <View style={s.filters}>
          <BookListFilters filters={this.state.filters} onChange={this.setFilters} />
        </View>

        <BookSelector query={this.state.query} openFilters={this.openFilters} />
      </Screen>
    );
  }

  setFilters = filters => this.setState(createQueryState(filters, this.state.sort));

  openFilters = () =>
    this.props.navigation.navigate('/modal/book-filters', {
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
