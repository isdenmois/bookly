import React from 'react';
import { View } from 'react-native';
import { NavigationStackProp } from 'react-navigation-stack/lib/typescript/types';
import { BookExtended } from 'types/book-extended';
import { ViewLineTouchable } from '../components/book-details-lines';
import { withScroll } from './tab';

interface Props {
  book: BookExtended;
  navigation: NavigationStackProp;
}

@withScroll
export class ChildrenTab extends React.PureComponent<Props> {
  render() {
    return (
      <View>
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
