import _ from 'lodash';
import { BOOK_TYPES } from 'types/book-types';

export const url = '/work/:bookId/similars';

export const cache = true;

export function mapParams({ bookId }: Params): Promise<BookSimilar[]> {
  return {
    query: { bookId },
  } as any;
}

const THUMBNAIL_ID = /(\d+$)/;
const types = [BOOK_TYPES.novel, BOOK_TYPES.story, BOOK_TYPES.shortstory];

export function filter(row) {
  return row && row.type === 'work' && types.includes(row.name_type_icon);
}

export const mapBody = {
  id: 'id',
  title: 'name',
  author: r => _.map(_.get(r, 'creators.authors'), a => a.name).join(', '),
  thumbnail: r => (r.image ? _.get(r.image.match(THUMBNAIL_ID), '0', null) : null),
  type: 'name_type',
};

export interface BookSimilar {
  id: string;
  title: string;
  author: string;
  type: string;
  thumbnail: string;
}

interface Params {
  bookId: string;
}
