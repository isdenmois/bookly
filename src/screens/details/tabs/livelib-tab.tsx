import React, { Component } from 'react';
import { Text, View, ToastAndroid, TextStyle, ViewStyle } from 'react-native';
import { NavigationStackProp } from 'react-navigation-stack';
import Book from 'store/book';
import { formatDate } from 'utils/date';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { dynamicColor } from 'types/colors';
import { database } from 'store';
import { LiveLibBook } from 'services/api/livelib/book';
import { hasUpdates } from 'utils/has-updates';
import { BookDescriptionLine, ViewLine, ViewLineModelRemove, ViewLineAction } from '../components/book-details-lines';
import { withScroll } from './tab';
import { DynamicStyleSheet } from 'react-native-dynamic';

interface Props {
  book: Book & LiveLibBook;
  isExist: boolean;
  navigation: NavigationStackProp;
  fantlabId: string;
  mode: string;
}

const paths = ['book', 'book.status', 'book.paper', 'mode'];

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
    const { book, isExist, mode } = this.props;
    const fantlabId = !!this.props.fantlabId;
    const hasPaper = book.paper;

    return (
      <View>
        {!book.thumbnail && !!book.avgRating && <ViewLine title='Средняя оценка' value={book.avgRating} mode={mode} />}
        {!!book.series && <ViewLine title='Серия' value={book.series} mode={mode} />}
        {!!book.isbn && <ViewLine title='ISBN' value={book.isbn} mode={mode} />}
        {book.status === BOOK_STATUSES.READ && <ViewLine title='Дата прочтения' value={this.readDate} mode={mode} />}
        {!!book.tags && <ViewLine title='Теги' value={book.tags} mode={mode} />}
        {!!book.cycles?.length && this.renderCycles()}
        {!!book.description && <BookDescriptionLine description={book.description} mode={mode} />}
        {!isExist && fantlabId && <ViewLineAction title='Ассоциировать книгу' onPress={this.associate} mode={mode} />}
        {isExist && <ViewLineAction title='Редактировать название' onPress={this.openEditModal} mode={mode} />}
        {isExist && (
          <ViewLineAction title={hasPaper ? 'Есть в бумаге' : 'Нет в бумаге'} onPress={this.togglePaper} mode={mode} />
        )}
        {isExist && <ViewLineModelRemove model={book} warning='Удалить книгу из коллекции' mode={mode} />}
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
    const mode = this.props.mode;
    const s = ds[mode];

    return (
      <View style={s.parentBooks}>
        <Text style={s.header}>ВХОДИТ В</Text>

        {this.props.book.cycles.map(book => (
          <ViewLine key={book.id} title={book.type} value={book.title} mode={mode} />
        ))}
      </View>
    );
  }
}

const ds = new DynamicStyleSheet({
  header: {
    color: dynamicColor.SecondaryText,
    fontSize: 14,
    marginBottom: 10,
  } as TextStyle,
  parentBooks: {
    marginTop: 10,
  } as ViewStyle,
});
