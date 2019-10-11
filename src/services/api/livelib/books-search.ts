import { LIVELIB_APIKEY } from 'react-native-dotenv';
import _ from 'lodash';
import { api } from '../base/api';

type Params = { q: string; page?: number };

const fields = 'id,name,author_name,author_id,pic_200';

function response(r) {
  const items = _.map(r.data, b => ({
    id: `l_${b.id}`,
    title: b.name,
    author: b.author_name,
    authors: [{ id: `l_${b.author_id}`, name: b.author_name }],
    thumbnail: b.pic_200,
    search: b.name,
    type: 'novel',
  }));

  return { items, total: r.count || 0 };
}

export default api
  .get<Params>('/books')
  .query(({ q, page }) => ({ q, andyll: LIVELIB_APIKEY, start: page, count: 24, fields }))
  .response(response);
