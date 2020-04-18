import _ from 'lodash';
import React from 'react';
import { Text, StyleSheet, View, ViewStyle, TextStyle, Platform, Switch } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { api, session } from 'services';
import { color } from 'types/colors';
import { formatDate } from 'utils/date';
import { withNavigationProps } from 'utils/with-navigation-props';
import Book, { BookData, createBook } from 'store/book';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { dbAction } from 'services/db';
import { database } from 'store';
import { Button, Dialog, DateTimePicker, ListItem, RatingSelect, Switcher, TouchIcon } from 'components';

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

const PRIMARY_BOOK_FIELDS = ['id', 'title', 'author', 'authors', 'thumbnail', 'type', 'search', 'paper'];

interface Props {
  navigation: NavigationScreenProp<any>;
  book: any;
  status: BOOK_STATUSES;
}

let defaultDate: Date;

@withNavigationProps()
export class ChangeStatusModal extends React.Component<Props> {
  state = {
    date: this.defaultDate,
    rating: this.props.book.rating || 0,
    status: this.defaultStatus,
    audio: this.props.book.audio,
    withoutTranslation: this.props.book.withoutTranslation,
    leave: this.props.book.leave,
    statusEditable: true,
    dateEditable: false,
  };

  get isFantlab() {
    return !this.props.book.id.startsWith('l_');
  }

  get isCreation() {
    const book = this.props.book;

    return !book.collection;
  }

  get defaultDate() {
    const book: Book = this.props.book;

    if (book.status === BOOK_STATUSES.READ) {
      return book.date;
    }

    if (session.saveDateInChangeStatus) {
      return defaultDate || new Date();
    }

    return new Date();
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
    const isWeb = Platform.OS === 'web';

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

          {status === BOOK_STATUSES.READ && isWeb && (
            <ListItem
              rowStyle={s.row}
              onPress={this.showDatePicker}
              icon={<Icon name='calendar-alt' style={s.icon} size={20} color={color.PrimaryText} />}
              value={formatDate(this.state.date)}
            >
              <DateTimePicker
                isVisible={this.state.dateEditable}
                date={this.state.date}
                onConfirm={this.setDate}
                onCancel={this.closeDatePicker}
              />
            </ListItem>
          )}
          {status === BOOK_STATUSES.READ && !isWeb && (
            <ListItem
              rowStyle={s.row}
              onPress={this.showDatePicker}
              icon={<Icon name='calendar-alt' style={s.icon} size={20} color={color.PrimaryText} />}
              value={formatDate(this.state.date)}
            />
          )}

          {status === BOOK_STATUSES.READ && (
            <>
              <ListItem rowStyle={s.row} icon={<Icon name='star' style={s.icon} size={20} color={color.PrimaryText} />}>
                <RatingSelect value={this.state.rating} onChange={this.setRating} />
              </ListItem>

              <ListItem
                rowStyle={s.row}
                label='Аудиокнига'
                icon={<Icon name='headphones' style={s.icon} size={20} color={color.PrimaryText} />}
                onPress={this.toggleAudio}
              >
                <Switch value={this.state.audio} onValueChange={this.toggleAudio} />
              </ListItem>

              <ListItem
                rowStyle={s.row}
                label='На языке оригинала'
                icon={<Icon name='language' style={s.icon} size={20} color={color.PrimaryText} />}
                onPress={this.toggleWithoutTranslation}
              >
                <Switch value={this.state.withoutTranslation} onValueChange={this.toggleWithoutTranslation} />
              </ListItem>

              {book.paper && (
                <ListItem
                  rowStyle={s.row}
                  label='Отдам'
                  icon={<Icon name='ban' style={s.icon} size={20} color={color.PrimaryText} />}
                  onPress={this.toggleLeave}
                >
                  <Switch value={this.state.leave} onValueChange={this.toggleLeave} />
                </ListItem>
              )}
            </>
          )}
        </View>

        {status === BOOK_STATUSES.READ && !isWeb && (
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

  onBack = () => this.props.navigation.goBack();

  toggleStatus = () => this.setState({ statusEditable: true });
  showDatePicker = () => this.setState({ dateEditable: true });
  closeDatePicker = () => this.setState({ dateEditable: false });

  setRating = rating => this.setState({ rating });
  setDate = date => this.setState({ date, dateEditable: false });
  setStatus = status => this.setState({ status, statusEditable: false });
  toggleAudio = () => this.setState({ audio: !this.state.audio });
  toggleWithoutTranslation = () => this.setState({ withoutTranslation: !this.state.withoutTranslation });
  toggleLeave = () => this.setState({ leave: !this.state.leave });

  fillData(data: Partial<BookData> = {}) {
    const { status, rating, date, withoutTranslation, audio, leave } = this.state;

    data.status = status;
    data.rating = rating;
    data.audio = audio;
    data.withoutTranslation = withoutTranslation;
    data.leave = leave;
    data.date = date;
    data.date.setHours(12, 0, 0, 0);

    return data;
  }

  updateBook() {
    const data: Partial<BookData> = this.fillData();

    return this.props.book.setData(data);
  }

  @dbAction createBook() {
    const book: Partial<BookData> = _.pick(this.props.book, PRIMARY_BOOK_FIELDS);

    this.fillData(book);

    return createBook(database, book);
  }

  save = () => {
    defaultDate = this.state.date;
    this.props.navigation.goBack();

    if (this.isCreation) {
      this.createBook();
    } else {
      this.updateBook();
    }

    if (this.isFantlab && this.state.status === BOOK_STATUSES.READ && this.session.withFantlab) {
      api.markWork(this.props.book.id, this.state.rating);
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
    justifyContent: 'space-between',
  },
  icon: {
    minWidth: 25,
  },
  switcher: {
    marginTop: 14,
    marginBottom: 10,
  } as ViewStyle,
});
