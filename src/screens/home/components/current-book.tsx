import React from 'react';
import withObservables from '@nozbe/with-observables';
import { Database } from '@nozbe/watermelondb';
import Book from 'store/book';
import { Carousel } from 'components';
import { currentBooksQuery } from '../home.queries';
import { NowReadingBook } from './now-reading-book';
import { EmptyBook } from './empty-book';

interface Props {
  database: Database;
  books?: Book[];
}

const withCurrentBooksCount: Function = withObservables(null, ({ database }) => ({
  books: currentBooksQuery(database).observeWithColumns(['thumbnail']),
}));

@withCurrentBooksCount
export class CurrentBook extends React.Component<Props> {
  render() {
    const books = this.props.books;
    const count = books?.length;

    if (count > 0) {
      return (
        <Carousel>
          {books.map(book => (
            <NowReadingBook key={book.id} book={book} />
          ))}
        </Carousel>
      );
    }

    return <EmptyBook database={this.props.database} />;
  }
}
