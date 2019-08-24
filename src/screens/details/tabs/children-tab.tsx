import React from 'react';
import { View } from 'react-native';
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
      <View>
        {this.props.book.children.map((book, index) => (
          <ViewLineTouchable
            key={book.id}
            onPress={() => this.openBook(book)}
            title={book.type}
            value={this.getChildBookTitle(book)}
            first={!index}
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
