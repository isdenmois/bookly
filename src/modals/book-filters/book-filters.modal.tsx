import React from 'react';
import _ from 'lodash';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { Database } from '@nozbe/watermelondb';
import { observer } from 'mobx-react';
import { withNavigationProps } from 'utils/with-navigation-props';
import { BookFilters as IBookFilters, BookSort } from 'types/book-filters';
import { inject, provider } from 'services';
import { Dialog, Button } from 'components';
import { BookListSort } from './components/book-list-sort';
import { BookYearFilter } from './components/book-year-filter';
import { BookAuthorFilter } from './components/book-author-filter';
import { BookTypeFilter } from './components/book-type-filter';
import { BookDateFilter } from './components/book-date-filter';
import { BookRatingFilter } from './components/book-rating-filter';
import { BookTitleFilter } from './components/book-title-fitler';
import { BookIsLiveLibFilter } from './components/book-is-livelib-filter';
import { BookPaperFilter } from './components/book-paper-filter';
import { BookFilters } from './book-filters.service';

const FILTER_COMPONENTS_MAP = {
  title: BookTitleFilter,
  year: BookYearFilter,
  author: BookAuthorFilter,
  type: BookTypeFilter,
  date: BookDateFilter,
  rating: BookRatingFilter,
  paper: BookPaperFilter,
  isLiveLib: BookIsLiveLibFilter,
};

interface Props {
  navigation: NavigationScreenProp<any>;
  filterFields: Array<keyof IBookFilters>;
  sortFields: string[];
  filters: Partial<IBookFilters>;
  sort: BookSort;
  setFilters: (filters: Partial<IBookFilters>, sort: BookSort) => void;
}

@provider(BookFilters)
@withNavigationProps()
@observer
export class BookFiltersModal extends React.Component<Props> {
  database = inject(Database);

  service = inject(BookFilters);

  constructor(props) {
    super(props);
    this.service.setInitial(props.filters, props.sort);
  }

  render() {
    const { filterFields, sortFields } = this.props;
    const changed = this.service.changed;

    return (
      <Dialog style={s.modalStyle} title='Фильтры' onApply={changed && this.save}>
        <ScrollView style={s.scroll} contentContainerStyle={s.filters}>
          {!!sortFields && <BookListSort fields={sortFields} value={this.service.sort} onChange={this.setSort} />}

          {_.map(filterFields, this.renderFilter)}
        </ScrollView>

        {changed && (
          <View style={s.buttonRow}>
            <Button label='Применить' onPress={this.save} />
          </View>
        )}
      </Dialog>
    );
  }

  renderFilter = (field: keyof IBookFilters) => {
    const Component = FILTER_COMPONENTS_MAP[field];

    return <Component key={field} status={this.props.filters.status} database={this.database} onApply={this.save} />;
  };

  setSort = (sort: BookSort) => this.service.setSort(sort);

  close = () => this.props.navigation.goBack();
  save = () => {
    const fields = this.props.filterFields;

    this.props.setFilters(this.service.getFilters(fields), this.service.sort);

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
