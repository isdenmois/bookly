import { Model } from '@nozbe/watermelondb';
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

export function prepareListBook(database, book) {
  const listBooks = database.collections.get('list_books');

  return book.lists.map(list =>
    listBooks.prepareCreate(listBook => {
      listBook._raw.id = `${list.id}_${book.id}`;
      listBook.list.id = list.id;
      listBook.book.id = book.id;
    }),
  );
}
