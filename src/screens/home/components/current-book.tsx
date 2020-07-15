import React from 'react';
import withObservables from '@nozbe/with-observables';
import Book from 'store/book';
import { Carousel } from 'components';
import { currentBooksQuery } from '../home.queries';
import { NowReadingBook } from './now-reading-book';
import { EmptyBook } from './empty-book';
import { Dimensions } from 'react-native';

interface Props {
  books?: Book[];
}

const PADDINGS = 48;

const withCurrentBooksCount: Function = withObservables(null, () => ({
  books: currentBooksQuery().observeWithColumns(['thumbnail']),
}));

@withCurrentBooksCount
export class CurrentBook extends React.Component<Props> {
  width = Dimensions.get('screen').width - PADDINGS;

  render() {
    const books = this.props.books;
    const count = books?.length;

    if (count > 0) {
      return (
        <Carousel width={this.width}>
          {books.map(book => (
            <NowReadingBook key={book.id} book={book} />
          ))}
        </Carousel>
      );
    }

    return <EmptyBook />;
  }
}
