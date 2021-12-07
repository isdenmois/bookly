import React from 'react';
import { Text, View, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { NavigationStackProp } from '@react-navigation/stack';
import { dynamicColor, lightText } from 'types/colors';
import { api } from 'services';
import { Fetcher, Thumbnail } from 'components';
import { BookSimilar } from 'services/api/fantlab/similar';
import { BookExtended } from 'types/book-extended';
import Book from 'store/book';
import { hasUpdates } from 'utils/has-updates';
import { DynamicStyleSheet, ColorSchemeContext } from 'react-native-dynamic';
import { MainRoutes } from 'navigation/routes';

interface Props {
  book: Book & BookExtended;
  navigation: NavigationStackProp;
}

export class SimilarTab extends React.Component<Props> {
  static contextType = ColorSchemeContext;

  shouldComponentUpdate(props, state) {
    return hasUpdates(this, props, state, ['book']);
  }

  render() {
    return (
      <View style={ds.dark.container}>
        <Fetcher bookId={this.props.book.id} api={api.similar} emptyText='Похожие книги не найдены'>
          {this.renderBook}
        </Fetcher>
      </View>
    );
  }

  renderBook = (book: BookSimilar, index: number) => {
    const s = ds[this.context];
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
    this.props.navigation.push(MainRoutes.Details, { bookId: String(book.id) });
  }
}

const ds = new DynamicStyleSheet({
  container: {
    padding: 16,
  },
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
    color: dynamicColor.PrimaryText,
    fontSize: 18,
  } as TextStyle,
  author: {
    color: dynamicColor.SecondaryText,
    fontSize: 18,
    ...lightText,
  } as TextStyle,
});
