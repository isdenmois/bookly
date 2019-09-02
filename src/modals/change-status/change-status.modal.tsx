import _ from 'lodash';
import React from 'react';
import { Text, StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { Database } from '@nozbe/watermelondb';
import { NavigationScreenProps } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { inject, Session } from 'services';
import { color } from 'types/colors';
import { formatDate } from 'utils/date';
import { withNavigationProps } from 'utils/with-navigation-props';
import { BookData, createBook } from 'store/book';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { dbAction } from 'services/db';
import { FantlabAPI } from 'services/api';
import { Button, Dialog, ListItem, RatingSelect, Switcher, TouchIcon } from 'components';

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

const PRIMARY_BOOK_FIELDS = ['id', 'title', 'author', 'authors', 'thumbnail', 'type', 'search'];

interface Props extends NavigationScreenProps {
  book: any;
  status: BOOK_STATUSES;
}

@withNavigationProps()
export class ChangeStatusModal extends React.Component<Props> {
  db = inject(Database);
  api = inject(FantlabAPI);
  session = inject(Session);

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
      <Dialog testID='changeStatusModal' style={s.dialog}>
        <View style={s.header}>
          <TouchIcon name='arrow-left' style={s.icon} size={20} color={color.PrimaryText} onPress={this.onBack} />
          <Text style={s.title} numberOfLines={1}>
            {book.title}
          </Text>
        </View>

        <View style={s.list}>
          <ListItem
            rowStyle={s.row}
            onPress={!statusEditable && this.toggleStatus}
            icon={<Icon name='book-reader' style={s.icon} size={20} color={color.PrimaryText} />}
            border={!statusEditable}
            value={statusMap[status]}
          >
            {statusEditable && (
              <Switcher style={s.switcher} options={statusOptions} value={status} onChange={this.setStatus} />
            )}
          </ListItem>

          {status === BOOK_STATUSES.READ && (
            <ListItem
              rowStyle={s.row}
              onPress={this.showDatePicker}
              icon={<Icon name='calendar-alt' style={s.icon} size={20} color={color.PrimaryText} />}
              value={formatDate(this.state.date)}
            />
          )}

          {status === BOOK_STATUSES.READ && (
            <ListItem rowStyle={s.row} icon={<Icon name='star' style={s.icon} size={20} color={color.PrimaryText} />}>
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
          testID='applyButton'
          disabled={this.disabled}
          label='Сохранить'
          style={s.button}
          textStyle={s.buttonText}
          onPress={this.save}
          bordered
        />
      </Dialog>
    );
  }

  onBack = () => this.props.navigation.pop();

  toggleStatus = () => this.setState({ statusEditable: true });
  showDatePicker = () => this.setState({ dateEditable: true });
  closeDatePicker = () => this.setState({ dateEditable: false });

  setRating = rating => this.setState({ rating });
  setDate = date => this.setState({ date, dateEditable: false });
  setStatus = status => this.setState({ status, statusEditable: false });

  updateBook() {
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

  @dbAction createBook() {
    const book: Partial<BookData> = _.pick(this.props.book, PRIMARY_BOOK_FIELDS);

    book.status = this.state.status;

    if (this.state.status === BOOK_STATUSES.READ) {
      book.rating = this.state.rating;
      book.date = this.state.date;
      book.date.setHours(12, 0, 0, 0);
    }

    return createBook(this.db, book);
  }

  save = () => {
    this.props.navigation.pop();
    if (this.isCreation) {
      this.createBook();
    } else {
      this.updateBook();
    }

    if (this.state.status === BOOK_STATUSES.READ && this.session.withFantlab) {
      this.api.markWork(this.props.book.id, this.state.rating);
    }
  };
}

const s = StyleSheet.create({
  dialog: {
    paddingHorizontal: 25,
    paddingVertical: 15,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  title: {
    color: color.PrimaryText,
    fontSize: 20,
    fontFamily: 'sans-serif-medium',
    alignSelf: 'center',
    flex: 1,
    marginLeft: 20,
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
  row: {
    paddingLeft: 5,
  },
  icon: {
    minWidth: 25,
  },
  switcher: {
    marginTop: 14,
    marginBottom: 10,
  } as ViewStyle,
});
