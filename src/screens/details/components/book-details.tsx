import React from 'react';
import format from 'date-fns/format';
import { ImageBackground, Text, View, ScrollView, StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import withObservables from '@nozbe/with-observables';
import Book from 'store/book';
import { BookExtended } from 'types/book-extended';
import { BOOK_TYPES } from 'types/book-types';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { Thumbnail } from 'components/thumbnail';
import { ReadButton } from 'components/read-button';
import { getAvatarBgColor } from 'components/avatar';
import { BookDetailsHeader } from './book-details-header';
import { BookDescriptionLine, ViewLine, ViewLineTouchable } from './book-details-lines';

interface Props extends NavigationScreenProps {
  book: BookExtended;
  record?: Book;
  onBack: () => void;
}

const THUMBNAIL_WIDTH = 120;
const MARGIN = 30;
const READ_BUTTON_MARGIN = 2 * MARGIN + THUMBNAIL_WIDTH;

@withObservables(['book'], ({ book }) => ({
  record: book.record || book,
}))
export class BookDetails extends React.Component<Props> {
  render() {
    const { book, record } = this.props;

    return (
      <View style={s.container}>
        {!!record.thumbnail && this.renderMainInfoWithThumbnail()}
        {!record.thumbnail && this.renderMainInfoWithoutThumbnail()}

        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}>
          <ViewLine first title='Тип' value={BOOK_TYPES[book.type]} />

          {!!book.genre && <ViewLine title='Жанр' value={book.genre} />}
          {!!book.year && <ViewLine title='Год' value={book.year} />}

          {record.status === BOOK_STATUSES.READ && (
            <ViewLine title='Дата прочтения' value={format(record.date, 'DD.MM.YYYY')} />
          )}

          {!!book.editionCount && <ViewLine title='Изданий' value={book.editionCount} />}
          <ViewLine title='Язык написания' value={book.language} />
          {!!book.originalTitle && <ViewLine title='Оригинальное название' value={book.originalTitle} />}

          {!!book.description && <BookDescriptionLine description={book.description} />}

          {!!book.parent.length && this.renderParentBooks()}
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
              <Thumbnail style={s.thumbnail} width={120} url={record.thumbnail} />
              <View style={s.mainInformation}>
                <Text style={s.title}>{record.title}</Text>
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
            <Text style={s.title}>{record.title}</Text>
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
        <Text>ВХОДИТ В</Text>

        {this.props.book.parent.map(book => (
          <ViewLineTouchable key={book.id} onPress={() => this.openParent(book)} title={book.type} value={book.title} />
        ))}
      </View>
    );
  }

  openChangeStatus = () => this.props.navigation.navigate('/modal/change-status', { book: this.props.book });

  openParent = book => this.props.navigation.push('Details', { bookId: book.id });
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
  title: {
    color: 'white',
    fontSize: 24,
  } as TextStyle,
  author: {
    color: 'white',
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
    color: 'black',
    fontSize: 18,
  } as TextStyle,
  whiteRating: {
    color: 'white',
    fontSize: 18,
  } as TextStyle,
});
