import React, { FC } from 'react';
import { Action, ActionSheet } from 'components/action-sheet';
import { database } from 'store';
import Book from 'store/book';
import { openModal } from 'services';
import { ModalRoutes, ModalScreenProps } from 'navigation/routes';

const ACTIONS: Action[] = [
  { id: 'edit' as const, label: 'modal.edit' },
  { id: 'delete' as const, label: 'details.delete', dangerous: true },
];

const HANDLERS = {
  edit: openBookEditor,
  delete: deleteBook,
};

type Props = ModalScreenProps<ModalRoutes.BookActions>;

export const BookActionsModal: FC<Props> = ({ route }) => {
  const onSelect = actionId => HANDLERS[actionId](route.params.bookId);

  return <ActionSheet actions={ACTIONS} onSelect={onSelect} />;
};

function openBookEditor(bookId) {
  openModal(ModalRoutes.BookEditor, { bookId });
}

async function deleteBook(bookId) {
  const book = await database.collections.get<Book>('books').find(bookId);

  await database.write(() => book.markAsDeleted());
}
