import React, { Component } from 'react';
import { Text, View, ToastAndroid, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { NavigationStackProp } from 'react-navigation-stack';
import Book from 'store/book';
import { formatDate } from 'utils/date';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { color } from 'types/colors';
import { database } from 'store';
import { LiveLibBook } from 'services/api/livelib/book';
import { hasUpdates } from 'utils/has-updates';
import { BookDescriptionLine, ViewLine, ViewLineModelRemove, ViewLineAction } from '../components/book-details-lines';
import { withScroll } from './tab';

interface Props {
  book: Book & LiveLibBook;
  isExist: boolean;
  navigation: NavigationStackProp;
  fantlabId: string;
}

const paths = ['book', 'book.status', 'book.paper'];

@withScroll
export class LivelibTab extends Component<Props> {
  shouldComponentUpdate(props, state) {
    return hasUpdates(this, props, state, paths);
  }

  get readDate() {
    const book = this.props.book;
    const parts = [formatDate(book.date), book.audio && 'аудиокнига', book.withoutTranslation && 'в оригинале'];

    return parts.filter(p => p).join(', ');
  }

  render() {
    const { book, isExist } = this.props;
    const fantlabId = !!this.props.fantlabId;
    const hasPaper = book.paper;

    return (
      <View>
        {!!book.series && <ViewLine title='Серия' value={book.series} />}
        {!!book.isbn && <ViewLine title='ISBN' value={book.isbn} />}
        {book.status === BOOK_STATUSES.READ && <ViewLine title='Дата прочтения' value={this.readDate} />}
        {!!book.tags && <ViewLine title='Теги' value={book.tags} />}
        {!!book.cycles?.length && this.renderCycles()}
        {!!book.description && <BookDescriptionLine description={book.description} />}
        {!isExist && fantlabId && <ViewLineAction title='Ассоциировать книгу' onPress={this.associate} />}
        {isExist && <ViewLineAction title='Редактировать название' onPress={this.openEditModal} />}
        {isExist && <ViewLineAction title={hasPaper ? 'Есть в бумаге' : 'Нет в бумаге'} onPress={this.togglePaper} />}
        {isExist && <ViewLineModelRemove model={book} warning='Удалить книгу из коллекции' />}
      </View>
    );
  }

  openEditModal = () => {
    this.props.navigation.push('/modal/book-title-edit', { book: this.props.book });
  };

  associate = async () => {
    const book: Book = (await database.collections.get('books').find(this.props.fantlabId)) as any;

    await book.setData({ lid: this.props.book.id.replace('l_', '') });

    ToastAndroid.show('Ассоциировано', ToastAndroid.SHORT);

    this.props.navigation.goBack();
  };

  togglePaper = () => {
    const book = this.props.book;

    book.setData({ paper: !book.paper });
  };

  renderCycles() {
    return (
      <View style={s.parentBooks}>
        <Text style={s.header}>ВХОДИТ В</Text>

        {this.props.book.cycles.map(book => (
          <ViewLine key={book.id} title={book.type} value={book.title} />
        ))}
      </View>
    );
  }
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
  classification: {
    marginBottom: 20,
  } as ViewStyle,
  title: {
    color: color.SecondaryText,
    fontSize: 12,
  } as TextStyle,
  value: {
    color: color.PrimaryText,
    fontSize: 18,
  } as TextStyle,
});
