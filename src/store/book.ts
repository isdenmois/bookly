import _ from 'lodash';
import { filter } from 'rxjs/operators';
import { Model, Q } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import { action, field, date, children, lazy } from '@nozbe/watermelondb/decorators';
import { Observable } from 'utils/model-observable';
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

  @field('title') title;
  @field('author') author;
  @field('status') status;
  @field('thumbnail') thumbnail;
  @field('rating') rating;
  @date('date') date;
  @field('type') type;
  @field('search') search;

  @lazy authors = this.collections.get('authors').query(Q.on('book_authors', 'book_id', this.id));
  @children('book_authors') bookAuthors;
  @children('reviews') reviews;

  async experimentalMarkAsDeleted(): Promise<void> {
    const authors = await this.authors.fetch();
    const emptyModel = _.omit(this._raw as any, ['_status', 'status', 'rating', 'date']);

    emptyModel._isCommitted = true;
    emptyModel.record = new Observable(this.collection.table, this.id, emptyModel);
    emptyModel.authors = _.map(authors, a => _.pick(a, ['id', 'name']));
    emptyModel._raw = emptyModel;

    emptyModel.record.observe().subscribe((this as any)._changes);

    return super.experimentalMarkAsDeleted();
  }

  _notifyDestroyed() {
    // Do nothing
  }

  observe() {
    return (this as any)._changes.pipe(
      filter((model: any) => model._isCommitted)
    );
  }

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
