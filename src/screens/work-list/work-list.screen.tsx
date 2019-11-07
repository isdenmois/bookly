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
  map = new Map();
  constructor(props) {
    super(props);

    this.props.works.forEach(work => {
      this.map.set(work.bookId, work.extra);
    });
  }
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
    return <BookItem key={book.id} book={book} extra={this.map.get(book.id)} />;
  };

  works = () => {
    const w = this.props.works.map(work => work.bookId).join(',');

    return this.api.works({ w }).then(works => {
      works.forEach(work => {
        Object.assign(work, this.map.get(work.id));
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
