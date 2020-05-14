import React from 'react';
import { Text, View, StyleSheet, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { NavigationStackProp } from 'react-navigation-stack';
import { color } from 'types/colors';
import { api } from 'services';
import { Fetcher, Thumbnail } from 'components';
import { BookSimilar } from 'services/api/fantlab/similar';
import { BookExtended } from 'types/book-extended';
import Book from 'store/book';
import { hasUpdates } from 'utils/has-updates';
import { withScroll } from './tab';

interface Props {
  book: Book & BookExtended;
  navigation: NavigationStackProp;
}

@withScroll
export class SimilarTab extends React.Component<Props> {
  shouldComponentUpdate(props, state) {
    return hasUpdates(this, props, state, ['book']);
  }

  render() {
    return (
      <Fetcher bookId={this.props.book.id} api={api.similar} emptyText='Похожие книги не найдены'>
        {this.renderBook}
      </Fetcher>
    );
  }

  renderBook = (book: BookSimilar, index: number) => {
    const style = index === 0 ? s.firstRow : s.row;

    return (
      <TouchableOpacity key={book.id} onPress={() => this.openBook(book)} style={style}>
        <Thumbnail title={book.title} url={book.thumbnail} width={50} height={80} />

        <View style={s.info}>
          <Text style={s.title}>{book.title}</Text>
          <Text style={s.author}>{book.author}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  openBook(book: BookSimilar) {
    this.props.navigation.push('Details', { bookId: String(book.id) });
  }
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
  } as ViewStyle,
  firstRow: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  info: {
    marginLeft: 10,
    flex: 1,
  } as ViewStyle,
  title: {
    color: color.PrimaryText,
    fontSize: 18,
  } as TextStyle,
  author: {
    color: color.SecondaryText,
    fontFamily: 'sans-serif-light',
    fontSize: 18,
  } as TextStyle,
});
