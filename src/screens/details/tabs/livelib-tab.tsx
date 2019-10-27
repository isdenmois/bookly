import React, { PureComponent } from 'react';
import { View, ToastAndroid } from 'react-native';
import { NavigationStackProp } from 'react-navigation-stack';
import Book from 'store/book';
import { formatDate } from 'utils/date';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { LiveLibBook } from 'services/api/livelib/book';
import { inject } from 'services';
import { Database } from '@nozbe/watermelondb';
import { BookDescriptionLine, ViewLine, ViewLineModelRemove, ViewLineAction } from '../components/book-details-lines';
import { withScroll } from './tab';

interface Props {
  book: Book & LiveLibBook;
  isExist: boolean;
  navigation: NavigationStackProp;
  fantlabId: string;
}

@withScroll
export class LivelibTab extends PureComponent<Props> {
  render() {
    const { book, isExist } = this.props;
    const fantlabId = !!this.props.fantlabId;

    return (
      <View>
        {!!book.series && <ViewLine title='Серия' value={book.series} />}
        {!!book.isbn && <ViewLine title='ISBN' value={book.isbn} />}
        {book.status === BOOK_STATUSES.READ && <ViewLine title='Дата прочтения' value={formatDate(book.date)} />}
        {!!book.tags && <ViewLine title='Теги' value={book.tags} />}
        {!!book.description && <BookDescriptionLine description={book.description} />}
        {!isExist && fantlabId && <ViewLineAction title='Ассоциировать книгу' onPress={this.associate} />}
        {isExist && <ViewLineAction title='Редактировать название' onPress={this.openEditModal} />}
        {isExist && <ViewLineModelRemove model={book} warning='Удалить книгу из коллекции' />}
      </View>
    );
  }

  openEditModal = () => {
    this.props.navigation.push('/modal/book-title-edit', { book: this.props.book });
  };

  associate = async () => {
    const book: Book = (await inject(Database)
      .collections.get('books')
      .find(this.props.fantlabId)) as any;

    await book.setData({ lid: this.props.book.id.replace('l_', '') });

    ToastAndroid.show('Ассоциировано', ToastAndroid.SHORT);

    this.props.navigation.goBack();
  };
}
