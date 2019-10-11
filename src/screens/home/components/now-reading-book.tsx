import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle, ImageStyle, TouchableOpacity } from 'react-native';
import withObservables from '@nozbe/with-observables';
import { Database } from '@nozbe/watermelondb';
import Book from 'store/book';
import { color } from 'types/colors';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { Navigation, inject } from 'services';
import { ReadButton, TextXL, Thumbnail } from 'components';
import { currentBooksQuery } from '../home.queries';

interface Props {
  database: Database;
  books?: Book[];
}

const withBooks: Function = withObservables(null, ({ database }: Props) => ({
  books: currentBooksQuery(database).observeWithColumns(['thumbnail']),
}));

@withBooks
export class NowReadingBook extends React.Component<Props> {
  navigation = inject(Navigation);

  render() {
    const books = this.props.books;
    const book = books && books[0];

    if (!book) return null;

    return (
      <View style={s.container}>
        <TouchableOpacity style={s.thumbnail} onPress={this.openBook}>
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
    this.navigation.navigate('/modal/change-status', { book: this.props.books[0], status: BOOK_STATUSES.READ });

  openBook = () => this.navigation.push('Details', { bookId: this.props.books[0].id });
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
