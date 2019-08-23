import React from 'react';
import withObservables from '@nozbe/with-observables';
import { Database } from '@nozbe/watermelondb';
import { currentBooksQuery } from '../home.queries';
import { NowReadingBook } from './now-reading-book';
import { EmptyBook } from './empty-book';

interface Props {
  database: Database;
  currentBooksCount?: number;
}

@withObservables(null, ({ database }) => ({
  currentBooksCount: currentBooksQuery(database).observeCount(),
}))
export class CurrentBook extends React.Component<Props> {
  render() {
    if (this.props.currentBooksCount > 0) {
      return <NowReadingBook database={this.props.database} />;
    }

    return <EmptyBook database={this.props.database} />;
  }
}
