import React from 'react';
import _ from 'lodash';
import { ScrollView, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';
import withObservables from '@nozbe/with-observables';
import { Database } from '@nozbe/watermelondb';
import { NavigationScreenProps } from 'react-navigation';
import Book from 'store/book';
import { BookItem } from 'components/book-item';
import { EmptyResult } from 'screens/search/empty-result';

interface Props extends NavigationScreenProps {
  query: any;
  sort: any;
  database: Database;
  books?: Book[];
}

@withObservables(['query', 'sort'], ({ database, query, sort }) => ({
  books: bookListQuery(database, query).observeWithColumns([sort]),
}))
export class BookList extends React.PureComponent<Props> {
  render() {
    if (!this.props.books || !this.props.books.length) {
      return <EmptyResult />;
    }

    const books = _.sortBy(this.props.books, this.props.sort.field);

    if (this.props.sort.desc) {
      books.reverse();
    }

    return (
      <ScrollView contentContainerStyle={s.scrollContainer}>
        <Text style={s.found}>Найдено: {books.length}</Text>
        {_.map(books, book => (
          <BookItem key={book.id} navigation={this.props.navigation} book={book} />
        ))}
      </ScrollView>
    );
  }
}

const s = StyleSheet.create({
  scrollContainer: {
    paddingTop: 10,
    paddingBottom: 60,
    paddingHorizontal: 10,
  } as ViewStyle,
  found: {
    fontSize: 18,
    color: 'black',
  } as TextStyle,
});

function bookListQuery(database, query) {
  return database.collections.get('books').query(...query);
}
