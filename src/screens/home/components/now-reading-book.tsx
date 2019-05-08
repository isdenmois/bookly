import React from 'react';
import { Linking, StyleSheet, Text, View, ViewStyle, TextStyle, ImageStyle, TouchableOpacity } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import withObservables from '@nozbe/with-observables';
import { Database } from '@nozbe/watermelondb';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Book from 'store/book';
import { currentBooksQuery } from '../home.service';
import { BOOK_STATUSES } from 'enums/book-statuses.enum';
import { Thumbnail } from 'components/thumbnail';
import { TextXL } from 'components/text';
import { Button } from 'components/button';
const { withNavigation } = require('react-navigation');

interface Props extends Partial<NavigationScreenProps> {
  database: Database;
  books?: Book[];
}

@withNavigation
@withObservables([], ({ database }) => ({
  books: currentBooksQuery(database).observe(),
}))
export class NowReadingBook extends React.Component<Props> {
  render() {
    const books = this.props.books;
    const book = books && books[0];

    if (!book) return null;

    return (
      <View style={s.container}>
        <TouchableOpacity style={s.thumbnail} onPress={this.openBook}>
          <Thumbnail width={120} height={192} title={book.title} url={book.thumbnail} />
        </TouchableOpacity>

        <View style={s.details}>
          <TouchableOpacity onPress={this.openBook}>
            <TextXL style={s.title}>{book.title}</TextXL>
          </TouchableOpacity>
          <Text style={s.author}>{book.author}</Text>
          <Button
            label='Сейчас читаю'
            icon={<Icon name='clock' size={18} color='#F57C00' />}
            style={s.orange}
            textStyle={s.textOrange}
            onPress={this.openChangeStatus}
            thin
          />
        </View>
      </View>
    );
  }

  openChangeStatus = () =>
    this.props.navigation.navigate('/modal/change-status', { book: this.props.books[0], status: BOOK_STATUSES.READ });

  openBook = () => Linking.openURL(`http://fantlab.ru/work${this.props.books[0].id}`);
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
  details: {
    alignItems: 'flex-start',
    flex: 1,
  } as ViewStyle,
  orange: {
    backgroundColor: '#FFE0B2',
    marginTop: 10,
  } as ViewStyle,
  textOrange: {
    fontSize: 18,
    color: '#F57C00',
  } as TextStyle,
  title: {
    color: 'black',
  } as TextStyle,
  author: {
    fontSize: 14,
    color: '#757575',
    marginTop: 5,
  } as TextStyle,
});
