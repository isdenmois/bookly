import _ from 'lodash';
import { Model } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import { action, field, date, children, readonly, json } from '@nozbe/watermelondb/decorators';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { prepareMissedAuthors } from './author';
import { prepareBookAuthors } from './book-author';
import { prepareListBooks } from './list-book';

const FIELDS = <const>[
  'title',
  'author',
  'thumbnail',
  'type',
  'search',
  'status',
  'rating',
  'date',
  'lid',
  'paper',
  'withoutTranslation',
  'audio',
  'leave',
  'reads',
];

export const READ_FIELDS = <const>['date', 'audio', 'withoutTranslation', 'paper', 'leave', 'rating'];

type BookFields = typeof FIELDS[number];

export type Read = Pick<Book, typeof READ_FIELDS[number]>;

export type BookData = Pick<Book, BookFields>;

const sanitizeReads = raw => (Array.isArray(raw) ? raw.map(row => ({ ...row, date: new Date(row.date) })) : []);

export default class Book extends Model {
  static table = 'books';
  static associations: Associations = {
    book_authors: { type: 'has_many', foreignKey: 'book_id' },
    list_books: { type: 'has_many', foreignKey: 'book_id' },
    reviews: { type: 'has_many', foreignKey: 'book_id' },
  };

  @field('lid') lid: string;
  @field('title') title: string;
  @field('author') author: string;
  @field('status') status: BOOK_STATUSES;
  @field('thumbnail') thumbnail: string;
  @field('rating') rating: number;
  @date('date') date: Date;
  @field('type') type;
  @field('search') search: string;
  @field('paper') paper: boolean;
  @field('without_translation') withoutTranslation: boolean;
  @field('audio') audio: boolean;
  @field('leave') leave: boolean;
  @json('reads', sanitizeReads) reads: Read[];

  @readonly @date('created_at') createdAt: Date;
  @readonly @date('updated_at') updatedAt: Date;

  // @lazy authors = this.collections.get('authors').query(Q.on('book_authors', 'book_id', this.id));
  @children('book_authors') bookAuthors;
  @children('list_books') listBooks;
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

  async markAsDeleted() {
    await this.bookAuthors.markAllAsDeleted();
    await this.listBooks.markAllAsDeleted();
    await this.reviews.markAllAsDeleted();
    await super.markAsDeleted();
  }
}

export async function createBook(database, data, lists) {
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
    ...prepareListBooks(database, data.id, lists),
  );

  return record;
}
