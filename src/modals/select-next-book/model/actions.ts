import { Q } from '@nozbe/watermelondb';
import { onStop } from 'nanostores';
import { Alert, ToastAndroid } from 'react-native';

import { api, database } from 'services';
import { createBook } from 'store/book';
import { BOOK_STATUSES } from 'types/book-statuses.enum';

import { $bookAddingInProgress, $selected, $selectedIds, $selectedLists } from './model';

export const onSelect = (id: string) => {
  $selected.setKey(id, !$selected.get()[id]);
};

export const onListSelect = (id: string) => {
  const set = new Set($selectedLists.get());

  if (set.has(id)) {
    set.delete(id);
  } else {
    set.add(id);
  }

  $selectedLists.set(set);
};

onStop($selected, () => {
  $selected.set({});
});

onStop($selectedLists, () => {
  $selectedLists.set(new Set());
});

export const addSelectedBooks = async (onSuccess: () => void) => {
  $bookAddingInProgress.set(true);
  const lists = Array.from($selectedLists.get());

  try {
    for (const bookId of $selectedIds.get()) {
      await bookFetchAndCreate(bookId, lists);
    }

    ToastAndroid.show('Successfully added new books', ToastAndroid.SHORT);
    onSuccess();
  } catch (e) {
    Alert.alert('Error', e?.message || e?.toString());
  }
  $bookAddingInProgress.set(false);
};

export const bookFetchAndCreate = async (bookId: string, lists: string[]) => {
  const existed = await database.get('books').query(Q.where('id', bookId)).fetchIds();

  if (existed.length > 0) {
    return;
  }

  const book = await api.book({ bookId });
  const data = {
    ...book,
    id: bookId,
    status: BOOK_STATUSES.WISH,
  };

  return database.write(() => createBook(database, data, lists));
};
