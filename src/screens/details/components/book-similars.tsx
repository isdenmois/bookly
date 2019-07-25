import React from 'react';
import _ from 'lodash';
import { Text, View, StyleSheet, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { color } from 'types/colors';
import { inject } from 'services';
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
  api = inject(FantlabAPI);

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
      <View style={s.container}>
        <Text style={s.header}>ПОХОЖИЕ</Text>

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
        <Thumbnail auto='none' title={book.title} url={book.thumbnail} width={50} height={80} />

        <View style={s.info}>
          <Text style={s.title}>{book.title}</Text>
          <Text style={s.author}>{book.author}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  openBook(book: BookSimilar) {
    this.props.navigation.push('Details', { bookId: book.id });
  }
}

const s = StyleSheet.create({
  container: {
    marginTop: 20,
  } as ViewStyle,
  header: {
    color: color.SecondaryText,
    fontSize: 14,
  } as TextStyle,
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
  } as ViewStyle,
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
    fontSize: 14,
  } as TextStyle,
});
