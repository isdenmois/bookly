import React from 'react';
import _ from 'lodash';
import { FlatList, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';
import withObservables from '@nozbe/with-observables';
import { Database } from '@nozbe/watermelondb';
import { NavigationScreenProps } from 'react-navigation';
import { color } from 'types/colors';
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
      <FlatList
        contentContainerStyle={s.scrollContainer}
        data={books}
        initialNumToRender={24}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        ListHeaderComponent={<Text style={s.found}>Найдено: {books.length}</Text>}
      />
    );
  }

  private renderItem = ({ item }) => {
    return <BookItem key={item.id} navigation={this.props.navigation} book={item} />;
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
});

function bookListQuery(database, query) {
  return database.collections.get('books').query(...query);
}
