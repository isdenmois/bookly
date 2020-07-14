import React from 'react';
import _ from 'lodash';
import { FlatList, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';
import withObservables from '@nozbe/with-observables';
import { Where } from '@nozbe/watermelondb/QueryDescription';
import { ScrollToTopContext } from 'utils/scroll-to-top';
import { BookSort, BookFilters } from 'types/book-filters';
import { color } from 'types/colors';
import { database } from 'store';
import Book from 'store/book';
import { BookItem, Button } from 'components';
import { EmptyResult } from 'components/fetcher';
import { BookListFilters } from './book-list-filters';
import { t } from 'services';

interface Props {
  query: Where[];
  sort: BookSort;
  filters: Partial<BookFilters>;
  onChange: (filters: Partial<BookFilters>) => void;
  books?: Book[];
  readonly?: boolean;
}

const YEAR = 1000 * 60 * 60 * 24 * 365;

const withBooks: Function = withObservables(['query', 'sort'], ({ query, sort }: Props) => ({
  books: bookListQuery(query).observeWithColumns(sort ? [sort.field] : []),
}));

@withBooks
export class BookList extends React.PureComponent<Props> {
  static contextType = ScrollToTopContext;

  render() {
    if (!this.props.books?.length) {
      return <EmptyResult text='Книги не найдены' />;
    }

    const order = this.props.sort.desc ? 'desc' : 'asc';
    const books = _.orderBy(this.props.books, this.props.sort.field, order);

    return (
      <FlatList
        contentContainerStyle={s.scrollContainer}
        data={books}
        initialNumToRender={24}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        ListHeaderComponent={this.renderHeader()}
        ListFooterComponent={this.renderFooter()}
        ref={this.context.setScroll}
      />
    );
  }

  private renderHeader() {
    return (
      <>
        <BookListFilters filters={this.props.filters} onChange={this.props.onChange} />
        <Text style={s.found}>
          {t('common.found')}: {this.props.books.length}
        </Text>
      </>
    );
  }

  private renderItem = ({ item }) => {
    return <BookItem key={item.id} book={item} cacheThumbnail />;
  };

  private renderFooter = () => {
    if (this.props.readonly) return null;
    const { year, date } = this.props.filters;
    const sort = this.props.sort;

    if ((!date && !year) || sort.field !== 'date' || !sort.desc) {
      return null;
    }

    const label = year || date.to.getTime() - date.from.getTime() > YEAR ? 'Еще год' : 'Еще месяц';

    return <Button style={s.moreButton} textStyle={s.buttonText} label={label} onPress={this.increaseDateFilter} />;
  };

  private increaseDateFilter = () => {
    const { year, date } = this.props.filters;
    let filters = this.props.filters;

    if (year) {
      filters = _.omit(filters, ['year']);
      filters.date = { from: new Date(year, 0, 1), to: new Date(year, 11, 31) };
    } else {
      filters = _.clone(filters);
      filters.date = _.clone(date);
    }

    if (year || filters.date.to.getTime() - filters.date.from.getTime() > YEAR) {
      filters.date.from.setFullYear(filters.date.from.getFullYear() - 1);
    } else {
      filters.date.from.setMonth(filters.date.from.getMonth() - 1);
    }

    this.props.onChange(filters);
  };

  private keyExtractor = book => book.id;
}

const s = StyleSheet.create({
  scrollContainer: {
    paddingTop: 10,
    paddingBottom: 60,
    paddingHorizontal: 10,
  } as ViewStyle,
  found: {
    fontSize: 18,
    color: color.PrimaryText,
  } as TextStyle,
  moreButton: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: color.Background,
    borderWidth: 0.5,
    borderColor: color.Border,
  } as ViewStyle,
  buttonText: {
    color: color.PrimaryText,
  } as TextStyle,
});

function bookListQuery(query: Where[]) {
  return database.collections.get('books').query(...query);
}
