import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle, ImageStyle, TextStyle } from 'react-native';
import withObservables from '@nozbe/with-observables';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { NavigationScreenProps } from 'react-navigation';
import { Thumbnail } from 'components/thumbnail';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import Book from 'store/book';

const NEXT_STATUSES = {
  [BOOK_STATUSES.WISH]: BOOK_STATUSES.NOW,
  [BOOK_STATUSES.NOW]: BOOK_STATUSES.READ,
  [BOOK_STATUSES.READ]: BOOK_STATUSES.READ,
};

const STATUS_ICONS = {
  [BOOK_STATUSES.WISH]: 'bookmark',
  [BOOK_STATUSES.NOW]: 'bookmark',
  [BOOK_STATUSES.READ]: 'flag',
};

const STATUS_COLORS = {
  bookmark: '#009688',
  flag: '#FFE0B2',
  star: '#F57C00',
};

interface Props extends Partial<NavigationScreenProps> {
  record?: Book;
  book?: Book;
  nextStatus?: BOOK_STATUSES;
}

@withObservables(['book'], ({ book }) => ({
  record: book.record || book,
}))
export class BookItem extends React.PureComponent<Props> {
  get book() {
    return this.props.record || this.props.book;
  }

  get nextStatus() {
    if (this.props.nextStatus) {
      return this.props.nextStatus;
    }

    return NEXT_STATUSES[this.book.status] || BOOK_STATUSES.WISH;
  }

  render() {
    const book = this.book;
    const nextStatus = this.nextStatus;
    const statusIcon = book.status === BOOK_STATUSES.READ ? 'star' : STATUS_ICONS[nextStatus];
    const statusColor = STATUS_COLORS[statusIcon];

    return (
      <View style={s.container}>
        <TouchableOpacity style={s.thumbnailView} onPress={this.openBook}>
          <View style={s.thumbnail}>
            <Thumbnail auto={null} style={s.image} width={65} height={100} title={book.title} url={book.thumbnail} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={s.row} onPress={this.openBook}>
          <View style={s.details}>
            <Text style={s.title}>{book.title}</Text>
            <Text style={s.author}>{book.author}</Text>
          </View>

          <TouchableOpacity style={s.status} onPress={this.openChangeStatusModal}>
            <View style={s.icon}>
              <Icon name={statusIcon} size={20} color={statusColor} />
              {book.status === BOOK_STATUSES.READ && <Text style={s.iconText}>{book.rating}</Text>}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  }

  openBook = () => {
    this.props.navigation.push('Details', { bookId: this.book.id });
  };

  openChangeStatusModal = () => {
    const book = this.book;
    const status = this.nextStatus;

    this.props.navigation.navigate('/modal/change-status', { book, status });
  };
}
const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 15,
  } as ViewStyle,
  thumbnailView: {
    backgroundColor: 'white',
    elevation: 4,
    borderRadius: 5,
    borderBottomRightRadius: 0,
  } as ViewStyle,
  thumbnail: {
    borderWidth: 0.5,
    borderRightWidth: 2,
    borderTopColor: '#0002',
    borderLeftColor: '#0003',
    borderBottomColor: '#0000',
    borderRightColor: '#2222',
    borderRadius: 5,
  } as ViewStyle,
  image: {
    borderRadius: 5,
  } as ImageStyle,
  row: {
    flexDirection: 'row',
    paddingLeft: 25,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: 'white',
    elevation: 4,
    flex: 1,
  } as ViewStyle,
  details: {
    paddingVertical: 10,
    flex: 1,
  } as ViewStyle,
  status: {
    paddingHorizontal: 15,
    justifyContent: 'center',
  } as ViewStyle,
  icon: {
    borderRadius: 10,
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 5,
    backgroundColor: 'white',
  } as ViewStyle,
  iconText: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 5,
  } as TextStyle,
  title: {
    fontSize: 16,
    color: 'black',
  } as TextStyle,
  author: {
    fontSize: 12,
    color: '#757575',
  } as TextStyle,
});
