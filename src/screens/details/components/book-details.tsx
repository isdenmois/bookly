import React from 'react';
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ToastAndroid,
  Clipboard,
} from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import withObservables from '@nozbe/with-observables';
import { color } from 'types/colors';
import { formatDate } from 'utils/date';
import Book from 'store/book';
import { BookExtended } from 'types/book-extended';
import { BOOK_TYPES, BOOK_TYPE_NAMES } from 'types/book-types';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { Thumbnail } from 'components/thumbnail';
import { ReadButton } from 'components/read-button';
import { getAvatarBgColor } from 'components/avatar';
import { BookDetailsHeader } from './book-details-header';
import { BookDescriptionLine, ViewLine, ViewLineTouchable } from './book-details-lines';
import { BookSimilars } from './book-similars';
import { FantlabReviewList } from './fantlab-review-list';

interface Props extends NavigationScreenProps {
  book: BookExtended;
  record?: Book;
  onBack: () => void;
}

const THUMBNAIL_WIDTH = 120;
const MARGIN = 30;
const READ_BUTTON_MARGIN = 2 * MARGIN + THUMBNAIL_WIDTH;
const SHOW_SIMILARS_ON = [BOOK_TYPES.novel, BOOK_TYPES.story, BOOK_TYPES.shortstory];

@withObservables(['book'], ({ book }) => ({
  record: book.record || book,
}))
export class BookDetails extends React.Component<Props> {
  get similarBooksVisible() {
    return SHOW_SIMILARS_ON.includes(this.props.record.type);
  }

  render() {
    const { book, record } = this.props;

    return (
      <View style={s.container}>
        {!!record.thumbnail && this.renderMainInfoWithThumbnail()}
        {!record.thumbnail && this.renderMainInfoWithoutThumbnail()}

        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}>
          <ViewLine first title='Тип' value={BOOK_TYPE_NAMES[book.type]} />

          {!!book.genre && <ViewLine title='Жанр' value={book.genre} />}
          {!!book.year && <ViewLine title='Год' value={book.year} />}

          {record.status === BOOK_STATUSES.READ && <ViewLine title='Дата прочтения' value={formatDate(record.date)} />}

          {!!book.editionCount && <ViewLine title='Изданий' value={book.editionCount} />}
          <ViewLine title='Язык написания' value={book.language} />
          {!!book.originalTitle && <ViewLine title='Оригинальное название' value={book.originalTitle} />}

          {!!book.otherTitles && <ViewLine title='Другие названия' value={book.otherTitles} />}

          {!!book.description && <BookDescriptionLine description={book.description} />}

          {!!book.children.length && this.renderChildrenBooks()}

          {!!book.parent.length && this.renderParentBooks()}

          {this.similarBooksVisible && <BookSimilars bookId={record.id} navigation={this.props.navigation} />}
          {this.similarBooksVisible && <FantlabReviewList bookId={record.id} />}
        </ScrollView>
      </View>
    );
  }

  renderMainInfoWithThumbnail() {
    const record = this.props.record;

    return (
      <>
        <ImageBackground style={s.imageBackground} blurRadius={1.5} source={{ uri: record.thumbnail }}>
          <View style={s.darkOverlay}>
            <BookDetailsHeader bookId={record.id} onBack={this.props.onBack} />
            <View style={s.mainInformationContainer}>
              <TouchableOpacity onPress={this.openChangeThumbnail}>
                <Thumbnail style={s.thumbnail} width={120} url={record.thumbnail} />
              </TouchableOpacity>

              <View style={s.mainInformation}>
                <TouchableWithoutFeedback onLongPress={this.copyBookTitle}>
                  <Text style={s.title}>{record.title}</Text>
                </TouchableWithoutFeedback>
                <Text style={s.author}>{record.author}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        <View style={s.statusButton}>
          <ReadButton ratingStyle={s.blackRating} openChangeStatus={this.openChangeStatus} book={record} />
        </View>
      </>
    );
  }

  renderMainInfoWithoutThumbnail() {
    const record = this.props.record;
    const backgroundColor = getAvatarBgColor(record.title);

    return (
      <View style={{ backgroundColor }}>
        <View style={s.darkOverlay}>
          <BookDetailsHeader bookId={record.id} onBack={this.props.onBack} />
          <View style={s.mainInformationWithoutThumbnail}>
            <TouchableWithoutFeedback onLongPress={this.copyBookTitle}>
              <Text style={s.title}>{record.title}</Text>
            </TouchableWithoutFeedback>
            <Text style={s.author}>{record.author}</Text>
            <ReadButton ratingStyle={s.whiteRating} openChangeStatus={this.openChangeStatus} book={record} />
          </View>
        </View>
      </View>
    );
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

  renderChildrenBooks() {
    return (
      <View style={s.parentBooks}>
        <Text style={s.header}>СОДЕРЖИТ</Text>

        {this.props.book.children.map(book => (
          <ViewLineTouchable
            key={book.id}
            onPress={() => this.openBook(book)}
            title={book.type}
            value={this.getChildBookTitle(book)}
          />
        ))}
      </View>
    );
  }

  getChildBookTitle(book) {
    if (book.year) {
      return `${book.title} (${book.year})`;
    }

    return book.title;
  }

  copyBookTitle = () => {
    Clipboard.setString(this.props.record.title);
    ToastAndroid.show('Название скопировано', ToastAndroid.SHORT);
  };

  openChangeStatus = () => this.props.navigation.navigate('/modal/change-status', { book: this.props.book });

  openChangeThumbnail = () => {
    if (!this.props.record.collection) {
      return ToastAndroid.show('Книга не добавлена в колекцию', ToastAndroid.SHORT);
    }

    if (this.props.book.editionCount <= 1) {
      return ToastAndroid.show('Недостаточно изданий для выбора', ToastAndroid.SHORT);
    }

    this.props.navigation.navigate('/modal/thumbnail-select', { book: this.props.record });
  };

  openBook(book) {
    this.props.navigation.push('Details', { bookId: book.id });
  }
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'stretch',
    flex: 1,
  } as ViewStyle,
  scroll: {
    flex: 1,
  } as ViewStyle,
  scrollContent: {
    padding: 15,
  } as ViewStyle,
  imageBackground: {
    width: '100%',
  } as ViewStyle,
  darkOverlay: {
    backgroundColor: 'rgba(0,0,0,.5)',
  } as ViewStyle,
  mainInformationContainer: {
    flexDirection: 'row',
    marginBottom: -50,
    marginTop: MARGIN,
  } as ViewStyle,
  thumbnail: {
    marginLeft: MARGIN,
  } as ImageStyle,
  mainInformation: {
    marginLeft: MARGIN,
    marginTop: MARGIN,
    marginBottom: 65,
    flex: 1,
    overflow: 'hidden',
  } as ViewStyle,
  header: {
    color: color.SecondaryText,
    fontSize: 14,
  } as TextStyle,
  title: {
    color: color.PrimaryTextInverse,
    fontSize: 24,
  } as TextStyle,
  author: {
    color: color.PrimaryTextInverse,
    fontSize: 18,
  } as TextStyle,
  statusButton: {
    alignSelf: 'flex-start',
    marginLeft: READ_BUTTON_MARGIN,
    marginBottom: 20,
  } as TextStyle,
  mainInformationWithoutThumbnail: {
    alignItems: 'flex-start',
    marginHorizontal: 15,
    marginBottom: 15,
  } as ViewStyle,
  parentBooks: {
    marginTop: 15,
  } as ViewStyle,
  blackRating: {
    color: color.PrimaryText,
    fontSize: 18,
  } as TextStyle,
  whiteRating: {
    color: color.PrimaryTextInverse,
    fontSize: 18,
  } as TextStyle,
});
