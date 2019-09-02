import _ from 'lodash';
import { BOOK_TYPES } from 'types/book-types';
import { API } from '../base/api';

const THUMBNAIL_ID = /(\d+$)/;
const types = [BOOK_TYPES.novel, BOOK_TYPES.story, BOOK_TYPES.shortstory];

interface Params {
  bookId: string;
}

const response = {
  id: 'id',
  title: 'name',
  author: r => _.map(_.get(r, 'creators.authors'), a => a.name).join(', '),
  thumbnail: r => (r.image ? _.get(r.image.match(THUMBNAIL_ID), '0', null) : null),
  type: 'name_type',
};

export default (api: API<Params>) =>
  api
    .get('/work/:bookId/similars', true)
    .filterBefore(row => row && row.type === 'work' && types.includes(row.name_type_icon))
    .response(response);

export interface BookSimilar {
  id: string;
  title: string;
  author: string;
  type: string;
  thumbnail: string;
}
