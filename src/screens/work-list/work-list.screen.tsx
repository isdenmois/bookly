import React, { Component } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { withNavigationProps } from 'utils/with-navigation-props';
import { API } from 'api';
import { inject } from 'services';
import { ScreenHeader, BookItem, Fetcher } from 'components';
import { color } from 'types/colors';
import Book from 'store/book';

interface Props {
  title: string;
  works: any[];
}

@withNavigationProps()
export class WorkListScreen extends Component<Props> {
  api = inject(API);

  render() {
    const title = this.props.title;
    return (
      <View style={s.container}>
        <ScreenHeader title={title} />

        <Fetcher
          contentContainerStyle={s.scroll}
          api={this.works}
          collection='books'
          emptyText='Книги не найдены'
          useFlatlist
        >
          {this.renderResult}
        </Fetcher>
      </View>
    );
  }

  renderResult = (book: Book) => {
    return <BookItem key={book.id} book={book} thumbnail={book.thumbnail} />;
  };

  works = () => {
    const w = this.props.works.map(work => work.bookId).join(',');
    const map = new Map();
    this.props.works.forEach(work => {
      map.set(work.bookId, work.thumbnail);
    });

    return this.api.works({ w }).then(works => {
      works.forEach(work => {
        work.thumbnail = map.get(work.id) || work.thumbnail;
      });

      return works;
    });
  };
}

const s = StyleSheet.create({
  container: {
    backgroundColor: color.Background,
    flex: 1,
  } as ViewStyle,
  scroll: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  } as ViewStyle,
});
