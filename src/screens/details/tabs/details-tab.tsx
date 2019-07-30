import React from 'react';
import { Dimensions, Animated, Text, View, ScrollView, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { color } from 'types/colors';
import { formatDate } from 'utils/date';
import Book from 'store/book';
import { BookExtended } from 'types/book-extended';
import { BOOK_TYPES, BOOK_TYPE_NAMES } from 'types/book-types';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { BookDescriptionLine, ViewLine, ViewLineTouchable } from '../components/book-details-lines';
import { BookSimilars } from '../components/book-similars';

interface Props extends NavigationScreenProps {
  book: BookExtended;
  record?: Book;
  scrollY: Animated.Value;
  headerHeight: number;
  y?: number;
  onScrollEnd: (y: number) => void;
}

const SHOW_SIMILARS_ON = [BOOK_TYPES.novel, BOOK_TYPES.story, BOOK_TYPES.shortstory];

export class DetailsTab extends React.PureComponent<Props> {
  get similarBooksVisible() {
    return SHOW_SIMILARS_ON.includes(this.props.record.type);
  }

  screenHeight = Dimensions.get('screen').height;
  y = 0;
  scroll: ScrollView;

  onScrollEnd = event => {
    const y = event.nativeEvent.contentOffset.y;

    this.y = y;
    this.props.onScrollEnd(y);
  };

  scrollTo(y: number) {
    this.y = y;

    if (this.scroll) {
      this.scroll.scrollTo({ y, animated: false });
    }
  }

  render() {
    const { book, record, scrollY, headerHeight } = this.props;
    const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true });

    return (
      <Animated.ScrollView
        onScroll={onScroll}
        style={s.scroll}
        onScrollEndDrag={this.onScrollEnd}
        onMomentumScrollEnd={this.onScrollEnd}
        contentContainerStyle={[
          s.scrollContent,
          { minHeight: this.screenHeight + headerHeight - 200, paddingTop: headerHeight + 30 },
        ]}
        ref={this.setRef}
      >
        <ViewLine first title='Тип' value={BOOK_TYPE_NAMES[book.type]} />

        {!!book.genre && <ViewLine title='Жанр' value={book.genre} />}
        {!!book.year && <ViewLine title='Год' value={book.year} />}

        {record.status === BOOK_STATUSES.READ && <ViewLine title='Дата прочтения' value={formatDate(record.date)} />}

        {!!book.editionCount && <ViewLine title='Изданий' value={book.editionCount} />}
        <ViewLine title='Язык написания' value={book.language} />
        {!!book.originalTitle && <ViewLine title='Оригинальное название' value={book.originalTitle} />}

        {!!book.otherTitles && <ViewLine title='Другие названия' value={book.otherTitles} />}

        {!!book.description && <BookDescriptionLine description={book.description} />}

        {!!book.children.length && this.renderChildrenBooks()}

        {!!book.parent.length && this.renderParentBooks()}

        {this.similarBooksVisible && <BookSimilars bookId={record.id} navigation={this.props.navigation} />}
      </Animated.ScrollView>
    );
  }

  renderParentBooks() {
    return (
      <View style={s.parentBooks}>
        <Text style={s.header}>ВХОДИТ В</Text>

        {this.props.book.parent.map(book => (
          <ViewLineTouchable key={book.id} onPress={() => this.openBook(book)} title={book.type} value={book.title} />
        ))}
      </View>
    );
  }

  renderChildrenBooks() {
    return (
      <View style={s.parentBooks}>
        <Text style={s.header}>СОДЕРЖИТ</Text>

        {this.props.book.children.map(book => (
          <ViewLineTouchable
            key={book.id}
            onPress={() => this.openBook(book)}
            title={book.type}
            value={this.getChildBookTitle(book)}
          />
        ))}
      </View>
    );
  }

  getChildBookTitle(book) {
    if (book.year) {
      return `${book.title} (${book.year})`;
    }

    return book.title;
  }

  openBook(book) {
    this.props.navigation.push('Details', { bookId: book.id });
  }

  setRef = view => (this.scroll = view && view._component);
}

const s = StyleSheet.create({
  scroll: {
    flex: 1,
  } as ViewStyle,
  scrollContent: {
    padding: 15,
  } as ViewStyle,
  header: {
    color: color.SecondaryText,
    fontSize: 14,
  } as TextStyle,
  parentBooks: {
    marginTop: 15,
  } as ViewStyle,
});
