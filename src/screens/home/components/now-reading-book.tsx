import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle, ImageStyle, TouchableOpacity } from 'react-native';
import Book from 'store/book';
import { color } from 'types/colors';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { navigation } from 'services';
import { ReadButton, TextXL, Thumbnail } from 'components';

interface Props {
  book: Book;
}

export class NowReadingBook extends React.Component<Props> {
  render() {
    const book = this.props.book;

    return (
      <View style={s.container}>
        <TouchableOpacity style={s.thumbnail} onPress={this.openBook} testID='CurrentThumbnail'>
          <Thumbnail cache style={s.image} width={120} height={192} title={book.title} url={book.thumbnail} />
        </TouchableOpacity>

        <View style={s.details}>
          <TouchableOpacity onPress={this.openBook}>
            <TextXL testID='homeBookTitle' style={s.title}>
              {book.title}
            </TextXL>
          </TouchableOpacity>
          <Text testID='homeBookAuthor' style={s.author}>
            {book.author}
          </Text>
          <ReadButton testID='homeReadButton' openChangeStatus={this.openChangeStatus} book={book} />
        </View>
      </View>
    );
  }

  openChangeStatus = () =>
    navigation.navigate('/modal/change-status', { book: this.props.book, status: BOOK_STATUSES.READ });

  openBook = () => navigation.push('Details', { bookId: this.props.book.id });
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 20,
    maxWidth: '100%',
  } as ViewStyle,
  thumbnail: {
    marginRight: 15,
    borderRadius: 5,
  } as ImageStyle,
  image: {
    borderRadius: 5,
  } as ImageStyle,
  details: {
    alignItems: 'flex-start',
    flex: 1,
  } as ViewStyle,
  title: {
    color: color.PrimaryText,
  } as TextStyle,
  author: {
    fontSize: 14,
    color: color.SecondaryText,
    marginTop: 5,
  } as TextStyle,
});
