import _ from 'lodash';
import { api } from '../base/api';

type Params = { e: string };
export default api
  .get<Params>('/search-ids')
  .query('e')
  .response(obj => editions(obj.editions));

function editions(e) {
  return _.map(e, el => ({ ...el, thumbnail: el.image ? `https:${el.image}` : null }));
}

export interface Edition {
  copies: number;
  id: number;
  image: string;
  isbns: string[];
  thumbnail: string;
  pages: number;
  published: number;
  url: string;
  year: number;
}
