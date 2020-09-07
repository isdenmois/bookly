import { Model, Q, Database } from '@nozbe/watermelondb';
import { immutableRelation } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';

export default class ListBook extends Model {
  static table = 'list_books';
  static associations: Associations = {
    lists: { type: 'belongs_to', key: 'list_id' },
    books: { type: 'belongs_to', key: 'book_id' },
  };

  @immutableRelation('lists', 'list_id') list;
  @immutableRelation('books', 'book_id') book;
}

export function prepareListBooks(database, bookId, lists) {
  const listBooks = database.collections.get('list_books');

  return lists.map(listId =>
    listBooks.prepareCreate(listBook => {
      listBook._raw.id = `${listId}_${bookId}`;
      listBook.list.id = listId;
      listBook.book.id = bookId;
    }),
  );
}

export async function prepareRemove(database: Database, bookId, ids) {
  const listBooks = database.collections.get<ListBook>('list_books');
  const list = await listBooks.query(Q.where('book_id', bookId), Q.where('list_id', Q.oneOf(ids))).fetch();

  return list.map(item => item.prepareMarkAsDeleted());
}

export function prepareAddBooks(database, listId, bookIds) {
  const listBooks = database.collections.get('list_books');

  return bookIds.map(bookId =>
    listBooks.prepareCreate(listBook => {
      listBook._raw.id = `${listId}_${bookId}`;
      listBook.list.id = listId;
      listBook.book.id = bookId;
    }),
  );
}

export async function prepareRemoveBooks(database: Database, listId, bookIds) {
  const listBooks = database.collections.get<ListBook>('list_books');
  const list = await listBooks.query(Q.where('list_id', listId), Q.where('book_id', Q.oneOf(bookIds))).fetch();

  return list.map(item => item.prepareMarkAsDeleted());
}
