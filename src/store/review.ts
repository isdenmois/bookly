
import { Model } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import { action, field, date, immutableRelation } from '@nozbe/watermelondb/decorators';
import format from 'date-fns/format'

type ReviewFields = 'id' | 'date' | 'body';

export type ReviewData = Pick<Review, ReviewFields>;

export default class Review extends Model {
  static table = 'reviews';

  static associations: Associations = {
    books: { type: 'belongs_to', key: 'book_id' },
  };

  @immutableRelation('books', 'book_id') book;
  @date('date') date: Date;
  @field('body') body: string;

  @action setBody(body: string) {
    return this.update(() => {
      this.body = body;
    });
  }
}

export function prepareReview(database, book, body) {
  const reviews = database.collections.get('reviews');

  return reviews.prepareCreate(review => {
    const created = new Date();

    review._raw.id = `${book.id}_${format(created, 'YYYYMMDD')}`;
    review.book.id = book.id
    review.date = created;
    review.body = body;
  })
}
