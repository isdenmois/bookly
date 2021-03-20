import React, { Component } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { api } from 'services';
import { BookItem, Fetcher } from 'components';
import { color } from 'types/colors';
import Book from 'store/book';
import { MainRoutes, MainScreenProps } from 'navigation/routes';

type Props = MainScreenProps<MainRoutes.WorkList>;

export class WorkListScreen extends Component<Props> {
  map = new Map();
  constructor(props) {
    super(props);

    this.props.route.params.works.forEach(work => {
      this.map.set(work.bookId, work.extra);
    });
  }

  componentDidMount() {
    this.props.navigation.setOptions({ headerTitle: this.props.route.params.title });
  }

  render() {
    return (
      <View style={s.container}>
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
    const w = this.props.route.params.works.map(work => work.bookId).join(',');

    return api.works({ w }).then(works => {
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
