import React from 'react';
import _ from 'lodash';
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { Where } from '@nozbe/watermelondb/QueryDescription';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { NavigationScreenProp } from 'react-navigation';
import { Database } from '@nozbe/watermelondb';
import { color } from 'types/colors';
import { BookSort, BookFilters } from 'types/book-filters';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { withScroll } from 'utils/scroll-to-top';
import { inject } from 'services';
import { Button, ScreenHeader } from 'components';
import { BookList } from './components/book-list';
import { createQueryState } from './book-list.service';

const defaultFilters = {
  year: 2019,
};

const READ_LIST_FILTERS = ['title', 'year', 'author', 'type', 'date', 'rating', 'isLiveLib'];

const READ_LIST_SORTS = ['date', 'title', 'rating', 'author', 'id'];

interface Props {
  navigation: NavigationScreenProp<any>;
}

interface State {
  query: Where[];
  sort: BookSort;
  filters: Partial<BookFilters>;
}

export class ReadList extends React.Component<Props, State> {
  state: State = createQueryState(
    {
      status: BOOK_STATUSES.READ,
      ...this.props.navigation.getParam('filters', defaultFilters),
    },
    { field: 'date', desc: true },
  );

  database = inject(Database);

  filters = READ_LIST_FILTERS;
  sorts = READ_LIST_SORTS;
  title = 'Прочитано';

  render() {
    const { query, sort, filters } = this.state;

    return (
      <View style={s.container}>
        <ScreenHeader title={this.title} query={this.state.filters.title} onSearch={this.setSearch} />
        <BookList database={this.database} query={query} sort={sort} filters={filters} onChange={this.setFilters} />
        <View style={s.buttonContainer}>
          <Button
            label='ФИЛЬТРЫ'
            onPress={this.openFiltersModal}
            icon={<Icon name='sliders-h' size={18} color={color.PrimaryText} />}
            style={s.button}
            textStyle={s.buttonText}
          />
        </View>
      </View>
    );
  }

  setFilters = (filters, sort = this.state.sort) => this.setState(createQueryState(filters, sort));
  setSearch = title => this.setState(createQueryState(this.createTitleFilter(title && title.trim()), this.state.sort));

  createTitleFilter(title: string) {
    return _.assign({}, this.state.filters, { title });
  }

  openFiltersModal = () =>
    this.props.navigation.navigate('/modal/book-filters', {
      setFilters: this.setFilters,
      filterFields: this.filters,
      sortFields: this.sorts,

      filters: this.state.filters,
      sort: this.state.sort,
    });
}

export const ReadListScreen = withScroll(ReadList);

const s = StyleSheet.create({
  container: {
    backgroundColor: color.Background,
    flex: 1,
  } as ViewStyle,
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  } as ViewStyle,
  button: {
    backgroundColor: color.Background,
    elevation: 3,
  } as ViewStyle,
  buttonText: {
    color: color.PrimaryText,
  } as TextStyle,
});
