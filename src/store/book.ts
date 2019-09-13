import _ from 'lodash';
import { Model } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import { action, field, date, children, readonly } from '@nozbe/watermelondb/decorators';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { prepareMissedAuthors } from './author';
import { prepareBookAuthors } from './book-author';

const FIELDS = ['title', 'author', 'thumbnail', 'type', 'search', 'status', 'rating', 'date'];

type BookFields = 'id' | 'title' | 'author' | 'thumbnail' | 'type' | 'search' | 'status' | 'rating' | 'date';

export type BookData = Pick<Book, BookFields>;

export default class Book extends Model {
  static table = 'books';
  static associations: Associations = {
    book_authors: { type: 'has_many', foreignKey: 'book_id' },
    reviews: { type: 'has_many', foreignKey: 'book_id' },
  };

  @field('title') title: string;
  @field('author') author: string;
  @field('status') status: BOOK_STATUSES;
  @field('thumbnail') thumbnail: string;
  @field('rating') rating: number;
  @date('date') date: Date;
  @field('type') type;
  @field('search') search: string;
  @readonly @date('created_at') createdAt: Date;

  // @lazy authors = this.collections.get('authors').query(Q.on('book_authors', 'book_id', this.id));
  @children('book_authors') bookAuthors;
  @children('reviews') reviews;

  @action setData(data: Partial<BookData>) {
    return this.update(() => {
      _.forEach(data, (value, key) => {
        this[key] = value;
      });
    });
  }

  @action setStatus(status: BOOK_STATUSES) {
    return this.update(() => {
      this.status = status;
    });
  }

  @action setThumbnail(thumbnail: string) {
    return this.update(() => {
      this.thumbnail = thumbnail ? thumbnail.toString() : null;
    });
  }
}

export async function createBook(database, data) {
  const record = database.collections.get('books').prepareCreate(book => {
    book._raw.id = data.id;
    _.forEach(FIELDS, f => {
      book[f] = data[f] || null;
    });
  });

  await database.batch(
    record,
    ...(await prepareMissedAuthors(database, data.authors)),
    ...prepareBookAuthors(database, data),
  );

  return record;
}
