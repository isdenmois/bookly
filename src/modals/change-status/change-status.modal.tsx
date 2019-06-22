import _ from 'lodash';
import React from 'react';
import { InjectorContext, inject } from 'react-ioc';
import { Text, StyleSheet, View, ViewStyle, ImageStyle, TextStyle } from 'react-native';
import { Database } from '@nozbe/watermelondb';
import { NavigationScreenProps } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from 'react-native-modal-datetime-picker';
import format from 'date-fns/format';
import { BookData } from 'store/book';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { createBook } from 'store/book';
import { dbSync, dbAction } from 'services/db';
import { Dialog } from 'components/dialog';
import { Thumbnail } from 'components/thumbnail';
import { Button } from 'components/button';
import { ListItem } from 'components/list-item';
import { Switcher } from 'components/switcher';
import { RatingSelect } from 'components/rating';
const { withMappedNavigationParams } = require('react-navigation-props-mapper');

const statusOptions = [
  { key: BOOK_STATUSES.WISH, title: 'Хочу прочитать' },
  { key: BOOK_STATUSES.NOW, title: 'Читаю' },
  { key: BOOK_STATUSES.READ, title: 'Прочитано' },
];

const statusMap = {
  [BOOK_STATUSES.WISH]: 'Хочу прочитать',
  [BOOK_STATUSES.NOW]: 'Сейчас читаю',
  [BOOK_STATUSES.READ]: 'Прочитано',
};

const PRIMARY_BOOK_FIELDS = ['id', 'title', 'author', 'authors', 'thumbnail', 'type', 'searchTitles'];

interface Props extends NavigationScreenProps {
  book: any;
  status: BOOK_STATUSES;
}

@withMappedNavigationParams()
export class ChangeStatusModal extends React.Component<Props> {
  static contextType = InjectorContext;

  db = inject(this, Database);

  state = {
    date: this.defaultDate,
    rating: this.defaultRating,
    status: this.defaultStatus,
    statusEditable: true,
    dateEditable: false,
  };

  get isCreation() {
    const book = this.props.book;

    return !book.collection;
  }

  get defaultDate() {
    const book = this.props.book;

    return book.date || new Date();
  }

  get defaultRating() {
    const book = this.props.book;

    return book.rating || 0;
  }

  get defaultStatus() {
    return this.props.status || this.props.book.status || BOOK_STATUSES.WISH;
  }

  get disabled() {
    if (this.state.status === BOOK_STATUSES.READ) {
      return !this.state.rating;
    }

    return false;
  }

  render() {
    const { book } = this.props;
    const { status, statusEditable } = this.state;

    return (
      <Dialog style={s.dialog} navigation={this.props.navigation}>
        <Thumbnail style={s.thumbnail} width={90} height={140} title={book.title} url={book.thumbnail} />
        <Text style={s.title}>{book.title}</Text>

        <View style={s.list}>
          <ListItem
            onPress={!statusEditable && this.toggleStatus}
            icon={<Icon name='book-reader' size={20} color='black' />}
            border={!statusEditable}
            value={statusMap[status]}
          >
            {statusEditable && (
              <Switcher style={s.switcher} options={statusOptions} value={status} onChange={this.setStatus} />
            )}
          </ListItem>

          {status === BOOK_STATUSES.READ && (
            <ListItem
              onPress={this.showDatePicker}
              icon={<Icon name='calendar-alt' size={20} color='black' />}
              value={format(this.state.date, 'DD.MM.YYYY')}
            />
          )}

          {status === BOOK_STATUSES.READ && (
            <ListItem icon={<Icon name='star' size={20} color='black' />}>
              <RatingSelect value={this.state.rating} onChange={this.setRating} />
            </ListItem>
          )}
        </View>

        {status === BOOK_STATUSES.READ && (
          <DateTimePicker
            isVisible={this.state.dateEditable}
            date={this.state.date}
            onConfirm={this.setDate}
            onCancel={this.closeDatePicker}
          />
        )}

        <Button
          disabled={this.disabled}
          label='Сохранить'
          style={s.button}
          textStyle={s.buttonText}
          onPress={this.save}
        />
      </Dialog>
    );
  }

  toggleStatus = () => this.setState({ statusEditable: true });
  showDatePicker = () => this.setState({ dateEditable: true });
  closeDatePicker = () => this.setState({ dateEditable: false });

  setRating = rating => this.setState({ rating });
  setDate = date => this.setState({ date, dateEditable: false });
  setStatus = status => this.setState({ status, statusEditable: false });

  @dbSync updateBook() {
    const { book } = this.props;
    const { status, rating, date } = this.state;
    const data: Partial<BookData> = { status };

    if (status === BOOK_STATUSES.READ) {
      data.rating = rating;
      data.date = date;
      data.date.setHours(12, 0, 0, 0);
    }

    return book.setData(data);
  }

  @dbAction async createBook() {
    const book: Partial<BookData> = _.pick(this.props.book, PRIMARY_BOOK_FIELDS);

    book.status = this.state.status;

    if (this.state.status === BOOK_STATUSES.READ) {
      book.rating = this.state.rating;
      book.date = this.state.date;
    }

    const record = await createBook(this.db, book);

    this.props.book.record.next(record);
  }

  save = () => {
    if (this.isCreation) {
      this.createBook();
    } else {
      this.updateBook();
    }
    this.props.navigation.pop();
  };
}

const s = StyleSheet.create({
  dialog: {
    paddingHorizontal: 35,
    paddingVertical: 15,
  } as ViewStyle,
  thumbnail: {
    position: 'relative',
    marginTop: '-30%',
    alignSelf: 'center',
    borderRadius: 20,
    borderColor: 'white',
    borderWidth: 3,
  } as ImageStyle,
  title: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 15,
    textAlign: 'center',
  } as TextStyle,
  list: {
    marginTop: 15,
  } as ViewStyle,
  button: {
    marginTop: 20,
  } as ViewStyle,
  buttonText: {
    flex: 1,
  } as ViewStyle,
  switcher: {
    marginTop: 13.5,
    marginBottom: 10,
  } as ViewStyle,
});
