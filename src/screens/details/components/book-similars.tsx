import React from 'react';
import _ from 'lodash';
import { Text, View, StyleSheet, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { inject, InjectorContext } from 'react-ioc';
import { FantlabAPI } from 'api';
import { Fetcher, Thumbnail } from 'components';
import { BookSimilar } from 'types/book-similar';

interface Props extends NavigationScreenProps {
  bookId: string;
}

function EmptyResult() {
  return null;
}

export class BookSimilars extends React.Component<Props> {
  static contextType = InjectorContext;

  api = inject(this, FantlabAPI);

  render() {
    return (
      <Fetcher bookId={this.props.bookId} api={this.api.similar} empty={EmptyResult}>
        {this.renderResult}
      </Fetcher>
    );
  }

  renderResult = (data: BookSimilar[], error) => {
    if (error) {
      return this.renderError(error);
    }

    return (
      <View>
        <Text>ПОХОЖИЕ</Text>

        {_.map(data, book => this.renderBook(book))}
      </View>
    );
  };

  renderError(error) {
    return <Text>{JSON.stringify(error)}</Text>;
  }

  renderBook(book: BookSimilar) {
    return (
      <TouchableOpacity key={book.id} onPress={() => this.openBook(book)} style={s.row}>
        {!!book.thumbnail && <Thumbnail auto='none' cache={false} url={book.thumbnail} width={50} height={80} />}
        <View>
          <Text>{book.title}</Text>
          <Text>{book.author}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  openBook(book: BookSimilar) {
    this.props.navigation.push('Details', { bookId: book.id });
  }
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
  } as ViewStyle,
});
