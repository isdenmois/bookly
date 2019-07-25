import React from 'react';
import { Q, Database } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import { map, sortBy, prop, isFalsy } from 'rambdax';

import { ScrollView, StyleSheet, Text, View, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { color } from 'types/colors';
import Book from 'store/book';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { ListItem, Thumbnail } from 'components';

interface Props {
  database: Database;
  search: string;
  selected: string;
  books?: Book[];
  onSelect: (book: Book) => void;
}

@withObservables(['search'], ({ database, search }: Props) => ({
  books: database.collections.get('books').query(...bookListQuery(search)),
}))
export class BookList extends React.Component<Props> {
  sortBooks = sortBy(prop('title'));

  render() {
    if (isFalsy(this.props.books)) {
      return <Text style={s.emptyText}>Нет книг</Text>;
    }

    const books = this.sortBooks(this.props.books);

    return <ScrollView style={s.scroll}>{map(this.renderBookItem, books)}</ScrollView>;
  }

  renderBookItem = (book, index) => {
    const selected = this.props.selected;
    const lastIndex = this.props.books.length;

    return (
      <ListItem
        key={book.id}
        style={s.listItem}
        icon={this.thumbnail(book)}
        last={index === lastIndex}
        selected={book.id === selected && <Icon name='check' size={18} color={color.Primary} />}
        onPress={() => this.props.onSelect(book)}
      >
        <View style={s.row}>
          <Text style={s.title}>{book.title}</Text>
          <Text style={s.author}>{book.author}</Text>
        </View>
      </ListItem>
    );
  };

  thumbnail(book) {
    return <Thumbnail style={s.thumbnail} auto={null} width={60} height={60} title={book.title} url={book.thumbnail} />;
  }
}

const s = StyleSheet.create({
  scroll: {
    maxHeight: 400,
  } as ViewStyle,
  listItem: {
    paddingHorizontal: 10,
  } as ViewStyle,
  row: {
    flex: 1,
  } as ViewStyle,
  thumbnail: {
    borderRadius: 5,
  } as ImageStyle,
  title: {
    fontSize: 16,
    color: color.PrimaryText,
  } as TextStyle,
  author: {
    color: color.SecondaryText,
    fontSize: 12,
    marginTop: 5,
  } as TextStyle,
  emptyText: {
    width: '100%',
    textAlign: 'center',
    paddingVertical: 20,
    color: color.SecondaryText,
    fontSize: 14,
  } as TextStyle,
});

function bookListQuery(search) {
  const queries = [booksSearchFilter(search), Q.where('status', BOOK_STATUSES.WISH)].filter(i => i);

  return queries.length > 1 ? [Q.and(...queries)] : queries;
}

function booksSearchFilter(search) {
  const queries = [
    search && Q.where('search', Q.like(`%${search}%`)),
    search && Q.where('author', Q.like(`%${search}%`)),
  ].filter(i => i);

  return queries.length ? Q.or(...queries) : null;
}
