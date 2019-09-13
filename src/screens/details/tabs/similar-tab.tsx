import React from 'react';
import { Text, View, StyleSheet, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { NavigationStackProp } from 'react-navigation-stack/lib/typescript/types';
import { color } from 'types/colors';
import { inject } from 'services';
import { FantlabAPI } from 'api';
import { Fetcher, Thumbnail } from 'components';
import { BookSimilar } from 'services/api/fantlab/similar';
import { BookExtended } from 'types/book-extended';
import { withScroll } from './tab';

interface Props {
  book: BookExtended;
  navigation: NavigationStackProp;
}

@withScroll
export class SimilarTab extends React.Component<Props> {
  api = inject(FantlabAPI);

  render() {
    return (
      <Fetcher bookId={this.props.book.id} api={this.api.similar} emptyText='Похожие книги не найдены'>
        {this.renderBook}
      </Fetcher>
    );
  }

  renderBook = (book: BookSimilar, index: number) => {
    const style = index === 0 ? s.firstRow : s.row;

    return (
      <TouchableOpacity key={book.id} onPress={() => this.openBook(book)} style={style}>
        <Thumbnail auto='none' title={book.title} url={book.thumbnail} width={50} height={80} />

        <View style={s.info}>
          <Text style={s.title}>{book.title}</Text>
          <Text style={s.author}>{book.author}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  openBook(book: BookSimilar) {
    this.props.navigation.push('Details', { bookId: book.id });
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
