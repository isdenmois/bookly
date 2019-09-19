import React, { Component } from 'react';
import { Animated, StyleSheet, Dimensions, ViewStyle, View } from 'react-native';
import { NavigationStackProp } from 'react-navigation-stack';
import Book from 'store/book';
import { formatDate } from 'utils/date';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { LiveLibBook } from 'services/api/livelib/book';
import { withBook } from 'components/book-item';
import { BookMainInfo } from './book-main-info';
import { BookDescriptionLine, ViewLine, ViewLineModelRemove } from './book-details-lines';

interface Props {
  book: Book & LiveLibBook;
  isExist: boolean;
  navigation: NavigationStackProp;
}

interface State {
  headerHeight: number;
}

const HEADER_HEIGHT = 60;

@withBook
export class LivelibInfo extends Component<Props, State> {
  state: State = { headerHeight: 0 };

  scrollY = new Animated.Value(0);
  screenHeight = Dimensions.get('window').height;

  render() {
    const { book, isExist } = this.props;
    const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: this.scrollY } } }], {
      useNativeDriver: true,
    });
    const paddingTop = this.state.headerHeight + 15;
    const minHeight = this.screenHeight + paddingTop - HEADER_HEIGHT - 38;

    return (
      <View>
        <BookMainInfo
          book={this.props.book as any}
          scrollY={this.scrollY}
          headerHeight={this.state.headerHeight}
          navigation={this.props.navigation}
          onLayout={this.setHeaderHeight}
          scrollHeight={HEADER_HEIGHT}
          status={book.status}
        />
        <Animated.ScrollView
          onScroll={onScroll}
          contentContainerStyle={[
            s.scrollContent,
            {
              minHeight,
              paddingTop,
            },
          ]}
        >
          {!!book.series && <ViewLine title='Серия' value={book.series} />}
          {!!book.isbn && <ViewLine title='ISBN' value={book.isbn} />}
          {book.status === BOOK_STATUSES.READ && <ViewLine title='Дата прочтения' value={formatDate(book.date)} />}
          {!!book.description && <BookDescriptionLine description={book.description} />}
          {isExist && <ViewLineModelRemove model={book} warning='Удалить книгу из коллекции' />}
        </Animated.ScrollView>
      </View>
    );
  }

  setHeaderHeight = ev => {
    const headerHeight = Math.round(ev.nativeEvent.layout.height) || 0;

    if (headerHeight !== this.state.headerHeight) {
      this.setState({ headerHeight });
    }
  };
}

const s = StyleSheet.create({
  scrollContent: {
    padding: 15,
  } as ViewStyle,
});
