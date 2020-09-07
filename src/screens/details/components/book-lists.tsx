import React, { useMemo } from 'react';
import Book from 'store/book';
import { Text, TextStyle } from 'react-native';
import { usePromise, useObservable } from 'utils/use-observable';
import { database } from 'store';
import List from 'store/list';
import ListBook, { prepareListBooks } from 'store/list-book';
import { Q } from '@nozbe/watermelondb';
import { ViewLineCheckbox } from './book-details-lines';
import { dynamicColor } from 'types/colors';
import { DynamicStyleSheet } from 'react-native-dynamic';
import { t } from 'services';

interface Props {
  book: Book;
  mode: any;
}

function getAllLists() {
  return database.collections.get<List>('lists').query().fetch();
}

function getBookLists([bookId]) {
  return database.collections.get<ListBook>('list_books').query(Q.where('book_id', bookId)).observe();
}

export function BookLists({ book, mode }: Props): any {
  const lists = usePromise(getAllLists, [], []);
  const bookLists = useObservable(getBookLists, [], [book.id]);
  const set = useMemo(() => new Set(bookLists.map(l => l.list.id)), [bookLists]);
  const s = ds[mode];

  return (
    <>
      <Text style={s.title}>{t('headers.lists').toUpperCase()}</Text>

      {lists.map(list => {
        const value = set.has(list.id);
        const toggle = () =>
          database.action(() => {
            if (value) {
              return bookLists.find(l => l.list.id === list.id).markAsDeleted();
            }

            return database.batch(prepareListBooks(database, book.id, [list.id]));
          });

        return <ViewLineCheckbox key={list.id} mode={mode} title={list.name} value={value} onToggle={toggle} />;
      })}
    </>
  );
}

const ds = new DynamicStyleSheet({
  title: {
    color: dynamicColor.SecondaryText,
    fontSize: 14,
    marginBottom: 10,
  } as TextStyle,
});
