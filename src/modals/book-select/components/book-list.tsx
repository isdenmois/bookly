import React from 'react';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import { sortBy, prop, isFalsy } from 'rambdax';

import { FlatList, Text, View, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { database } from 'store';
import { dynamicColor, getColor, boldText, lightText } from 'types/colors';
import Book from 'store/book';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { ListItem, Thumbnail } from 'components';
import { DynamicStyleSheet, ColorSchemeContext } from 'react-native-dynamic';

interface Props {
  search: string;
  selected: string | Set<string>;
  books?: Book[];
  onSelect: (book: Book | string) => void;
  onUnselect?: (book: string) => void;
}

const ITEM_HEIGHT = 75;

const withBooks: Function = withObservables(['search'], ({ search }: Props) => ({
  books: database.collections.get('books').query(...bookListQuery(search)),
}));

@withBooks
export class BookList extends React.Component<Props> {
  static contextType = ColorSchemeContext;
  color: string;

  sortBooks = sortBy(prop('title'));

  render() {
    const s = ds[this.context];
    this.color = getColor(this.context).Primary;

    if (isFalsy(this.props.books)) {
      return <Text style={s.emptyText}>Нет книг</Text>;
    }

    const books = this.sortBooks(this.props.books);

    return (
      <FlatList
        style={s.scroll}
        data={books}
        keyExtractor={b => b.id}
        renderItem={this.renderBookItem}
        getItemLayout={this.getItemLayout}
        extraData={this.props.selected}
      />
    );
  }

  private getItemLayout(data, index) {
    return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index };
  }

  renderBookItem = ({ item: book, index }) => {
    const s = ds[this.context];
    const selected: any = this.props.selected;
    const lastIndex = this.props.books.length;
    let isSelected: boolean;

    if (typeof selected === 'object') {
      isSelected = selected.has(book.id);
    } else {
      isSelected = book.id === selected;
    }

    const onPress = () => {
      if (this.props.onUnselect) {
        if (isSelected) {
          this.props.onUnselect(book.id);
        } else {
          this.props.onSelect(book.id);
        }
      } else {
        this.props.onSelect(book);
      }
    };

    return (
      <ListItem
        key={book.id}
        style={s.listItem}
        icon={this.thumbnail(book, s)}
        last={index === lastIndex}
        selected={isSelected && <Icon name='check' size={18} color={this.color} />}
        testID={`BookToSelect${book.id}`}
        onPress={onPress}
      >
        <View style={s.row}>
          <Text style={s.title}>{book.title}</Text>
          <Text style={s.author}>{book.author}</Text>
        </View>
      </ListItem>
    );
  };

  thumbnail(book) {
    return <Thumbnail style={ds.dark.thumbnail} width={60} height={60} title={book.title} url={book.thumbnail} cache />;
  }
}

const ds = new DynamicStyleSheet({
  scroll: {
    maxHeight: 400,
  } as ViewStyle,
  listItem: {
    paddingHorizontal: 15,
  } as ViewStyle,
  row: {
    flex: 1,
  } as ViewStyle,
  thumbnail: {
    borderRadius: 5,
  } as ImageStyle,
  title: {
    fontSize: 16,
    color: dynamicColor.PrimaryText,
    ...boldText,
  } as TextStyle,
  author: {
    color: dynamicColor.SecondaryText,
    fontSize: 16,
    marginTop: 5,
    ...lightText,
  } as TextStyle,
  emptyText: {
    width: '100%',
    textAlign: 'center',
    paddingVertical: 20,
    color: dynamicColor.SecondaryText,
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
