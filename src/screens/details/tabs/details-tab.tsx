import React from 'react';
import { Text, View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { color } from 'types/colors';
import { formatDate } from 'utils/date';
import Book from 'store/book';
import { BookExtended } from 'types/book-extended';
import { BOOK_TYPE_NAMES } from 'types/book-types';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import {
  BookDescriptionLine,
  ViewLine,
  ViewLineTouchable,
  ViewLineModelRemove,
} from '../components/book-details-lines';
import { withScroll } from './tab';

interface Props extends NavigationScreenProps {
  book: BookExtended;
  isExist: boolean;
  record?: Book;
}

@withScroll
export class DetailsTab extends React.PureComponent<Props> {
  render() {
    const { book, record, isExist } = this.props;

    return (
      <View>
        <ViewLine first title='Тип' value={BOOK_TYPE_NAMES[book.type]} />

        {!!book.genre && <ViewLine title='Жанр' value={book.genre} />}
        {!!book.year && <ViewLine title='Год' value={book.year} />}

        {record.status === BOOK_STATUSES.READ && <ViewLine title='Дата прочтения' value={formatDate(record.date)} />}

        {!!book.editionCount && <ViewLine title='Изданий' value={book.editionCount} />}
        <ViewLine title='Язык написания' value={book.language} />
        {!!book.originalTitle && <ViewLine title='Оригинальное название' value={book.originalTitle} />}

        {!!book.otherTitles && <ViewLine title='Другие названия' value={book.otherTitles} />}

        {!!book.description && <BookDescriptionLine description={book.description} />}

        {!!book.parent.length && this.renderParentBooks()}

        {isExist && <ViewLineModelRemove model={record} warning='Удалить книгу из коллекции' />}
      </View>
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

  openBook(book) {
    this.props.navigation.push('Details', { bookId: book.id });
  }
}

const s = StyleSheet.create({
  header: {
    color: color.SecondaryText,
    fontSize: 14,
  } as TextStyle,
  parentBooks: {
    marginTop: 15,
  } as ViewStyle,
});
