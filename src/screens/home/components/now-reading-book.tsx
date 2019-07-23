import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle, ImageStyle, TouchableOpacity } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import withObservables from '@nozbe/with-observables';
import { Database } from '@nozbe/watermelondb';
import Book from 'store/book';
import { color } from 'types/colors';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { Thumbnail } from 'components/thumbnail';
import { TextXL } from 'components/text';
import { ReadButton } from 'components/read-button';
const { withNavigation } = require('react-navigation');
import { currentBooksQuery } from '../home.service';

interface Props extends Partial<NavigationScreenProps> {
  database: Database;
  books?: Book[];
}

@withNavigation
@withObservables([], ({ database }) => ({
  books: currentBooksQuery(database).observeWithColumns(['thumbnail']),
}))
export class NowReadingBook extends React.Component<Props> {
  render() {
    const books = this.props.books;
    const book = books && books[0];

    if (!book) return null;

    return (
      <View style={s.container}>
        <TouchableOpacity style={s.thumbnail} onPress={this.openBook}>
          <Thumbnail style={s.image} width={120} height={192} title={book.title} url={book.thumbnail} />
        </TouchableOpacity>

        <View style={s.details}>
          <TouchableOpacity onPress={this.openBook}>
            <TextXL style={s.title}>{book.title}</TextXL>
          </TouchableOpacity>
          <Text style={s.author}>{book.author}</Text>
          <ReadButton testID='homeReadButton' openChangeStatus={this.openChangeStatus} book={book} />
        </View>
      </View>
    );
  }

  openChangeStatus = () =>
    this.props.navigation.navigate('/modal/change-status', { book: this.props.books[0], status: BOOK_STATUSES.READ });

  openBook = () => this.props.navigation.push('Details', { bookId: this.props.books[0].id });
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
