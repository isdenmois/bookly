import React from 'react';
import _ from 'lodash';
import { inject, InjectorContext } from 'react-ioc';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { Database } from '@nozbe/watermelondb';
import { withNavigationProps } from 'utils/with-navigation-props';
import { Button } from 'components/button';
import { Dialog } from 'components/dialog';
import { BookListSort } from './components/book-list-sort';
import { BookYearFilter } from './components/book-year-filter';
import { BookAuthorFilter } from './components/book-author-filter';
import { BookTypeFilter } from './components/book-type-filter';
import { BookDateFilter } from './components/book-date-filter';
import { BookRatingFilter } from './components/book-rating-filter';
import { BookTitleFilter } from './components/book-title-fitler';

const FILTER_COMPONENTS_MAP = {
  title: BookTitleFilter,
  year: BookYearFilter,
  author: BookAuthorFilter,
  type: BookTypeFilter,
  date: BookDateFilter,
  rating: BookRatingFilter,
};

interface Props extends NavigationScreenProps {
  filterFields: string[];
  sortFields: string[];
  filters: any;
  sort: any;
  setFilters: (filters: any, sort: any) => void;
}

interface State {
  sort: any;
  status: string;
  title: string;
  changed: boolean;
}

@withNavigationProps()
export class BookFiltersModal extends React.Component<Props, State> {
  static contextType = InjectorContext;

  database = inject(this, Database);

  state: State = this.createDefaultState();

  render() {
    const { filterFields, sortFields, navigation } = this.props;
    const changed = this.state.changed;

    return (
      <Dialog style={s.modalStyle} navigation={navigation} title='Фильтры' onApply={changed && this.save}>
        <ScrollView style={s.scroll} contentContainerStyle={s.filters}>
          <BookListSort value={this.state.sort} onChange={this.setSort} fields={sortFields} />

          {_.map(filterFields, this.renderFilter)}
        </ScrollView>

        {this.state.changed && (
          <View style={s.buttonRow}>
            <Button label='Применить' onPress={this.save} />
          </View>
        )}
      </Dialog>
    );
  }

  renderFilter = field => {
    const Component = FILTER_COMPONENTS_MAP[field];

    return (
      <Component
        key={field}
        value={this.state[field]}
        database={this.database}
        status={this.state.status}
        onChange={this.changeFilter}
        onApply={this.save}
      />
    );
  };

  setSort = sort => this.setState({ sort, changed: true });
  changeFilter = (filter, value) => this.setState({ [filter]: value, changed: true } as any);

  createDefaultState() {
    const { filters, sort } = this.props;

    return { ...filters, sort };
  }

  setFilters = this.props.setFilters;

  close = () => this.props.navigation.pop();
  save = () => {
    const filters = _.omit(this.state, ['sort', 'changed']);

    if (filters.title) {
      filters.title = filters.title.trim();
    }

    this.setFilters(filters, this.state.sort);

    this.close();
  };
}

const s = StyleSheet.create({
  modalStyle: {
    paddingBottom: 10,
  } as ViewStyle,
  scroll: {
    flexGrow: 0,
    marginBottom: 15,
  } as ViewStyle,
  filters: {
    paddingHorizontal: 20,
  } as ViewStyle,
  buttonRow: {
    alignItems: 'center',
    paddingBottom: 5,
  } as ViewStyle,
});
