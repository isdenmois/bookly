import { Model } from '@nozbe/watermelondb';
import { immutableRelation } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';

export default class BookAuthor extends Model {
  static table = 'book_authors';
  static associations: Associations = {
    authors: { type: 'belongs_to', key: 'author_id' },
    books: { type: 'belongs_to', key: 'book_id' },
  };

  @immutableRelation('authors', 'author_id') author;
  @immutableRelation('books', 'book_id') book;
}

export function prepareBookAuthors(database, book) {
  const bookAuthors = database.collections.get('book_authors');

  return book.authors.map(author =>
    bookAuthors.prepareCreate(bookAuthor => {
      bookAuthor._raw.id = `${book.id}_${author.id}`;
      bookAuthor.book.id = book.id;
      bookAuthor.author.id = author.id;
    }),
  );
}
