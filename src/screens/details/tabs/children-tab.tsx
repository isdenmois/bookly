import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { BookExtended } from 'types/book-extended';
import { ViewLineTouchable } from '../components/book-details-lines';
import { withScroll } from './tab';

interface Props extends NavigationScreenProps {
  book: BookExtended;
}

@withScroll
export class ChildrenTab extends React.PureComponent<Props> {
  render() {
    return (
      <View style={s.childrenBooks}>
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

  openBook(book) {
    this.props.navigation.push('Details', { bookId: book.id });
  }
}

const s = StyleSheet.create({
  childrenBooks: {
    marginTop: 15,
  } as ViewStyle,
});
