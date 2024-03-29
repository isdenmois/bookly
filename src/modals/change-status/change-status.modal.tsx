import _ from 'lodash';
import React from 'react';
import { Text, View, ViewStyle, TextStyle, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Q } from '@nozbe/watermelondb';
import { DynamicStyleSheet, ColorSchemeContext } from 'react-native-dynamic';

import { ModalRoutes, ModalScreenProps } from 'navigation/routes';
import { api, settings, t } from 'services';
import { dynamicColor, getColor, boldText } from 'types/colors';
import { formatDate } from 'utils/date';
import Book, { BookData, createBook, READ_FIELDS } from 'store/book';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { dbAction } from 'services/db';
import { database } from 'store';
import { Button, Checkbox, Dialog, DateTimePicker, ListItem, RatingSelect, Switcher, TouchIcon } from 'components';
import ListBook, { prepareListBooks, prepareRemove } from 'store/list-book';
import { AddToList } from './add-to-list';

const PRIMARY_BOOK_FIELDS = ['id', 'title', 'author', 'authors', 'thumbnail', 'type', 'search', 'paper'];

type Props = ModalScreenProps<ModalRoutes.ChangeStatus>;

let defaultDate: Date;

export class ChangeStatusModal extends React.Component<Props> {
  static contextType = ColorSchemeContext;

  state = {
    date: this.defaultDate,
    rating: this.props.route.params.book.rating || 0,
    status: this.defaultStatus,
    audio: this.props.route.params.book.audio,
    withoutTranslation: this.props.route.params.book.withoutTranslation,
    leave: this.props.route.params.book.leave,
    paper: this.props.route.params.book.paper,
    statusEditable: true,
    dateEditable: false,
    initialLists: [],
    lists: new Set<string>(),
    reread: false,
    inProgress: false,
  };

  statusMap = {
    [BOOK_STATUSES.WISH]: t('button.wish'),
    [BOOK_STATUSES.NOW]: t('button.current'),
    [BOOK_STATUSES.READ]: t('button.read'),
  };
  statusOptions = [
    { key: BOOK_STATUSES.WISH, title: t('button.wish') },
    { key: BOOK_STATUSES.NOW, title: t('button.reading') },
    { key: BOOK_STATUSES.READ, title: t('button.read') },
  ];

  get isFantlab() {
    return !this.props.route.params.book.id.startsWith('l_');
  }

  get isCreation() {
    const book = this.props.route.params.book;

    return !book.collection;
  }

  get defaultDate() {
    const book: Book = this.props.route.params.book;

    if (book.status === BOOK_STATUSES.READ) {
      return book.date;
    }

    if (settings.saveDateInChangeStatus) {
      return defaultDate || new Date();
    }

    return new Date();
  }

  get defaultStatus() {
    return this.props.route.params.status || this.props.route.params.book.status || BOOK_STATUSES.WISH;
  }

  get disabled() {
    if (this.state.inProgress) {
      return true;
    }

    if (this.state.status === BOOK_STATUSES.READ) {
      return !this.state.rating;
    }

    return false;
  }

  async componentDidMount() {
    if (this.isCreation) return null;
    const listBooks = database.collections.get<ListBook>('list_books');
    const listModels = await listBooks.query(Q.where('book_id', this.props.route.params.book.id)).fetch();
    const lists = listModels.map(list => list.list.id);

    this.setState({ initialLists: lists, lists: new Set(lists) });
  }

  render() {
    const { book } = this.props.route.params;
    const { status, statusEditable } = this.state;
    const isWeb = Platform.OS === 'web';
    const s = ds[this.context];
    const color = getColor(this.context);
    const hasRead = !this.isCreation && book.status === BOOK_STATUSES.READ;

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
            value={this.statusMap[status]}
          >
            {statusEditable && (
              <Switcher style={s.switcher} options={this.statusOptions} value={status} onChange={this.setStatus} />
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

              {settings.audio && (
                <ListItem
                  rowStyle={s.row}
                  label={t('common.audiobook')}
                  icon={<Icon name='headphones' style={s.icon} size={20} color={color.PrimaryText} />}
                  onPress={this.toggleAudio}
                >
                  <Checkbox value={this.state.audio} onValueChange={this.toggleAudio} />
                </ListItem>
              )}

              {settings.withoutTranslation && (
                <ListItem
                  rowStyle={s.row}
                  label={t('common.original')}
                  icon={<Icon name='language' style={s.icon} size={20} color={color.PrimaryText} />}
                  onPress={this.toggleWithoutTranslation}
                >
                  <Checkbox value={this.state.withoutTranslation} onValueChange={this.toggleWithoutTranslation} />
                </ListItem>
              )}

              {settings.paper && !book.paper && (
                <ListItem
                  rowStyle={s.row}
                  label={t('details.has-paper')}
                  icon={<Icon name='book' style={s.icon} size={20} color={color.PrimaryText} />}
                  onPress={this.togglePaper}
                >
                  <Checkbox value={this.state.paper} onValueChange={this.togglePaper} />
                </ListItem>
              )}

              {settings.paper && (book.paper || this.state.paper) && (
                <ListItem
                  rowStyle={s.row}
                  label={t('details.leave')}
                  icon={<Icon name='ban' style={s.icon} size={20} color={color.PrimaryText} />}
                  onPress={this.toggleLeave}
                >
                  <Checkbox value={this.state.leave} onValueChange={this.toggleLeave} />
                </ListItem>
              )}

              {hasRead && (
                <ListItem
                  rowStyle={s.row}
                  label={t('details.reread')}
                  icon={<Icon name='redo' style={s.icon} size={20} color={color.PrimaryText} />}
                  onPress={this.toggleReread}
                >
                  <Checkbox value={this.state.reread} onValueChange={this.toggleReread} />
                </ListItem>
              )}
            </>
          )}

          {status === BOOK_STATUSES.WISH && (
            <AddToList bookLists={this.state.lists} onChange={this.setLists} color={color} />
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
          label={t('button.apply')}
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
  togglePaper = () => this.setState({ paper: !this.state.paper });
  toggleReread = () => {
    const reread = !this.state.reread;

    this.setState({ reread, date: reread ? new Date() : this.defaultDate });
  };
  setLists = lists => this.setState({ lists });

  fillData(data: Partial<BookData> = {}) {
    const { status, rating, date, withoutTranslation, audio, leave, paper } = this.state;

    data.status = status;
    data.rating = rating;
    data.audio = audio;
    data.withoutTranslation = withoutTranslation;
    data.paper = paper;
    data.leave = leave;
    data.date = date;
    data.date.setHours(12, 0, 0, 0);

    return data;
  }

  getLists() {
    if (this.state.status !== BOOK_STATUSES.WISH) return [];

    return Array.from(this.state.lists);
  }

  @dbAction async updateBook() {
    const book = this.props.route.params.book;
    const data: Partial<BookData> = this.fillData();
    const lists = this.getLists();
    const toAddLists = _.difference(lists, this.state.initialLists);
    const toRemoveLists = _.difference(this.state.initialLists, lists);

    if (this.state.reread) {
      data.reads = [_.pick(book, READ_FIELDS)].concat(book.reads);
    }

    return database.batch(
      book.prepareUpdate(() => Object.assign(book, data)),
      ...prepareListBooks(database, book.id, toAddLists),
      ...(await prepareRemove(database, book.id, toRemoveLists)),
    );
  }

  @dbAction createBook() {
    const book: Partial<BookData> = _.pick(this.props.route.params.book, PRIMARY_BOOK_FIELDS);

    this.fillData(book);

    return createBook(database, book, this.getLists());
  }

  save = async () => {
    defaultDate = this.state.date;

    if (this.isCreation) {
      this.createBook();
    } else {
      this.updateBook();
    }

    if (this.isFantlab && this.state.status === BOOK_STATUSES.READ && settings.withFantlab) {
      this.setState({ inProgress: true });
      try {
        await api.markWork(this.props.route.params.book.id, this.state.rating);
      } catch (e) {
        console.log(e);
      }
    }

    if (settings.selectNextBook && this.isFantlab && this.state.status === BOOK_STATUSES.READ) {
      this.setState({ inProgress: true });

      try {
        const hasParents = await this.checkBookForParents();

        if (hasParents) {
          this.props.navigation.replace(ModalRoutes.SelectNextBook, { bookId: this.props.route.params.book.id });
          return;
        }
      } catch (e) {
        console.log(e);
      }

      this.setState({ inProgress: false });
    }

    this.props.navigation.goBack();
  };

  async checkBookForParents() {
    const book = this.props.route.params.book;
    const bookData = await api.book({ bookId: book.id });

    return !!bookData.parent?.length;
  }
}

const ds = new DynamicStyleSheet({
  dialog: {
    paddingHorizontal: 25,
    paddingVertical: 15,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  title: {
    color: dynamicColor.PrimaryText,
    fontSize: 20,
    alignSelf: 'center',
    flex: 1,
    marginLeft: 20,
    ...boldText,
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
