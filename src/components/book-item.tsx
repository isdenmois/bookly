import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle, ImageStyle, TextStyle, Platform } from 'react-native';
import withObservables from '@nozbe/with-observables';
import { of } from 'rxjs/internal/observable/of';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getColor, dynamicColor } from 'types/colors';
import { navigation } from 'services';
import { Thumbnail } from 'components/thumbnail';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import Book, { BookData } from 'store/book';
import { formatDate } from 'utils/date';
import { ColorSchemeContext, DynamicStyleSheet } from 'react-native-dynamic';

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
  bookmark: 'Primary',
  flag: 'Secondary',
  star: 'Secondary',
};

interface Props {
  book: Book;
  nextStatus?: BOOK_STATUSES;
  cacheThumbnail?: boolean;
  fantlabId?: string;
  extra?: Partial<BookData>;
}

export const withBook: Function = withObservables(['book'], ({ book }: Props) => ({
  book: book.observe ? book : of(book),
}));

@withBook
export class BookItem extends React.Component<Props> {
  static contextType = ColorSchemeContext;

  get nextStatus() {
    if (this.props.nextStatus) {
      return this.props.nextStatus;
    }

    return NEXT_STATUSES[this.props.book.status] || BOOK_STATUSES.WISH;
  }

  render() {
    const book = this.props.book;
    const nextStatus = this.nextStatus;
    const statusIcon = book.status === BOOK_STATUSES.READ ? 'star' : STATUS_ICONS[nextStatus];
    const cache = this.props.cacheThumbnail;
    const s = ds[this.context];
    const color = getColor(this.context);
    const statusColor = color[STATUS_COLORS[statusIcon]];
    const isSolid = book.status === BOOK_STATUSES.WISH;

    return (
      <View style={s.container}>
        <TouchableOpacity style={s.thumbnailView} onPress={this.openBook} onLongPress={this.openBookActions}>
          <View style={s.thumbnail}>
            <Thumbnail cache={cache} style={s.image} width={65} height={100} title={book.title} url={book.thumbnail} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.row}
          onPress={this.openBook}
          onLongPress={this.openBookActions}
          testID={`bookItem${book.id}`}
        >
          <View style={s.details}>
            <Text style={s.title}>{book.title}</Text>
            <Text style={s.author}>{book.author}</Text>
          </View>

          <TouchableOpacity
            style={s.status}
            onPress={this.openChangeStatusModal}
            testID={`changeStatusButton${book.id}`}
          >
            <View style={s.icon}>
              <Icon name={statusIcon} size={20} color={statusColor} solid={isSolid} />
              {book.status === BOOK_STATUSES.READ && <Text style={s.iconText}>{book.rating}</Text>}
            </View>
            {book.status === BOOK_STATUSES.READ && <Text style={s.date}>{formatDate(book.date)}</Text>}
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  }

  openBook = () => {
    const { book, fantlabId, extra } = this.props;

    navigation.push('Details', { bookId: book.id, fantlabId, extra });
  };

  openBookActions = () => {
    navigation.navigate('/modal/book-actions', { bookId: this.props.book.id });
  };

  openChangeStatusModal = () => {
    const book = this.props.book;
    const status = this.nextStatus;

    navigation.navigate('/modal/change-status', { book, status });
  };
}
const ds = new DynamicStyleSheet({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 15,
  } as ViewStyle,
  thumbnailView: {
    backgroundColor: dynamicColor.BookItem,
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
    backgroundColor: dynamicColor.BookItem,
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
    backgroundColor: dynamicColor.BookItem,
  } as ViewStyle,
  iconText: {
    fontSize: 16,
    color: dynamicColor.PrimaryText,
    marginLeft: 5,
  } as TextStyle,
  title: {
    fontSize: 16,
    color: dynamicColor.PrimaryText,
  } as TextStyle,
  author: {
    fontSize: 12,
    color: dynamicColor.SecondaryText,
  } as TextStyle,
  date: {
    fontSize: 10,
    color: dynamicColor.SecondaryText,
  } as TextStyle,
});
