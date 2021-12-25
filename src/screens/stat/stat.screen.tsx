import React from 'react';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Q } from '@nozbe/watermelondb';

import { useObservable } from 'utils/use-observable';
import { Screen } from 'components';
import { settings } from 'services';
import { database } from 'store';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { CURRENT_YEAR, mapBooks, StatBook } from './tabs/shared';
import { Stat } from './stat';

export function StatScreen() {
  const { books, minYear } = useObservable(BooksList, { books: [], minYear: CURRENT_YEAR }, []);

  return (
    <Screen>
      <Stat books={books} minYear={minYear} />
    </Screen>
  );
}

function BooksList(): Observable<{ books: StatBook[]; minYear: number }> {
  const min = new Date(settings.minYear, 0, 1, 0, 0, 0).getTime();

  return database.collections
    .get('books')
    .query(Q.where('status', BOOK_STATUSES.READ), Q.where('date', Q.gte(min)))
    .observeWithColumns(['date', 'rating', 'paper', 'audio', 'withoutTranslation', 'leave'])
    .pipe(map(mapBooks) as any);
}
