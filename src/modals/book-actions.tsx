import React from 'react';
import { Action, ActionSheet } from 'components/action-sheet';
import { database } from 'store';
import Book from 'store/book';

const ACTIONS: Action[] = [
  { id: 'edit' as const, label: 'modal.edit' },
  { id: 'delete' as const, label: 'details.delete', dangerous: true },
];

const HANDLERS = {
  edit: openBookEditor,
  delete: deleteBook,
};

export function BookActionsModal({ navigation }) {
  const onSelect = actionId => HANDLERS[actionId](navigation);

  return <ActionSheet actions={ACTIONS} onSelect={onSelect} />;
}

function openBookEditor(navigation) {
  const bookId = navigation.getParam('bookId');

  navigation.navigate('/modal/book-editor', { bookId });
}

async function deleteBook(navigation) {
  const bookId = navigation.getParam('bookId');
  const book = await database.collections.get<Book>('books').find(bookId);

  await database.action(() => book.markAsDeleted());
}
