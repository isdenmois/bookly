import React from 'react';
import _ from 'lodash';
import { Q, Database } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';

import { ScrollView, StyleSheet, Text, View, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Book from 'store/book';
import { BOOK_STATUSES } from 'enums/book-statuses.enum';
import { ListItem } from 'components/list-item';
import { Thumbnail } from 'components/thumbnail';

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
  render() {
    const lastIndex = _.size(this.props.books) - 1;
    const { selected } = this.props;

    if (_.isEmpty(this.props.books)) {
      return <Text style={s.emptyText}>Нет книг</Text>;
    }

    return (
      <ScrollView style={s.scroll}>
        {_.map(this.props.books, (book, index) => (
          <ListItem
            key={book.id}
            style={s.listItem}
            icon={this.thumbnail(book)}
            last={index === lastIndex}
            selected={book.id === selected && <Icon name='check' size={18} color='#009688' />}
            onPress={() => this.props.onSelect(book)}
          >
            <View style={s.row}>
              <Text style={s.title}>{book.title}</Text>
              <Text style={s.author}>{book.author}</Text>
            </View>
          </ListItem>
        ))}
      </ScrollView>
    );
  }

  thumbnail(book) {
    return (
      <Thumbnail style={s.thumbnail} auto={false} width={60} height={60} title={book.title} url={book.thumbnail} />
    );
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
    color: 'black',
  } as TextStyle,
  author: {
    color: '#757575',
    fontSize: 12,
    marginTop: 5,
  } as TextStyle,
  emptyText: {
    width: '100%',
    textAlign: 'center',
    paddingVertical: 20,
    color: '#757575',
    fontSize: 14,
  } as TextStyle,
});

function bookListQuery(search) {
  const queries = [booksSearchFilter(search), Q.where('status', BOOK_STATUSES.WISH)].filter(i => i);

  return queries.length > 1 ? [Q.and(...queries)] : queries;
}

function booksSearchFilter(search) {
  const queries = [
    search && Q.where('searchTitles', Q.like(`%${search}%`)),
    search && Q.where('author', Q.like(`%${search}%`)),
  ].filter(i => i);

  return queries.length ? Q.or(...queries) : null;
}
