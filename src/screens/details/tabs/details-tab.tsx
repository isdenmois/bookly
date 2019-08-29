import React from 'react';
import { Text, View, StyleSheet, ViewStyle, TextStyle, Linking, ToastAndroid } from 'react-native';
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
  book: Book & BookExtended;
  isExist: boolean;
  tab: string;
}

const TITLE_SEPARATOR = /\s*;\s*/g;

@withScroll
export class DetailsTab extends React.PureComponent<Props> {
  render() {
    const { book, isExist } = this.props;
    const all = this.props.tab !== 'main';
    const withGenre = all || !book.thumbnail;

    return (
      <View>
        {all && <ViewLine title='Тип' value={BOOK_TYPE_NAMES[book.type]} />}

        {withGenre && !!book.genre && <ViewLine title='Жанр' value={book.genre} />}
        {withGenre && !!book.year && <ViewLine title='Год' value={book.year} />}

        {this.renderTranslators()}

        {book.status === BOOK_STATUSES.READ && <ViewLine title='Дата прочтения' value={formatDate(book.date)} />}

        {!!book.editionCount && (
          <ViewLineTouchable
            title='Изданий'
            value={book.editionCount}
            onPress={this.openEditions}
            onLongPress={this.openChangeThumbnail}
          />
        )}

        {!!book.language && <ViewLine title='Язык написания' value={book.language} />}
        {!!book.title && !!book.originalTitle && (
          <ViewLineTouchable title='Оригинальное название' value={book.originalTitle} onPress={this.openTelegram} />
        )}

        {!!book.otherTitles && (
          <ViewLine title='Другие названия' value={book.otherTitles.replace(TITLE_SEPARATOR, '\n')} />
        )}

        {all && !!book.description && <BookDescriptionLine description={book.description} />}

        {!!book.parent.length && this.renderParentBooks()}

        {all && isExist && <ViewLineModelRemove model={book} warning='Удалить книгу из коллекции' />}
      </View>
    );
  }

  renderTranslators() {
    if (!this.props.book.translators.length) {
      return null;
    }

    const translators = this.props.book.translators;
    const title = translators.length > 1 ? 'Переводчики' : 'Переводчик';

    return <ViewLine title={title} value={translators.join('\n')} />;
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

  openEditions = () => {
    const { editionIds, editionTranslators } = this.props.book;

    this.props.navigation.push('Editions', { editionIds, translators: editionTranslators });
  };

  openTelegram = () => Linking.openURL(`tg://share?text=${this.props.book.originalTitle}`);

  openChangeThumbnail = () => {
    if (!this.props.isExist) {
      return ToastAndroid.show('Книга не добавлена в колекцию', ToastAndroid.SHORT);
    }

    this.props.navigation.navigate('/modal/thumbnail-select', { book: this.props.book });
  };
}

const s = StyleSheet.create({
  header: {
    color: color.SecondaryText,
    fontSize: 14,
    marginBottom: 10,
  } as TextStyle,
  parentBooks: {
    marginTop: 10,
  } as ViewStyle,
});
