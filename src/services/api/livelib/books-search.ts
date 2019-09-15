import { LIVELIB_APIKEY } from 'react-native-dotenv';
import _ from 'lodash';
import { api } from '../base/api';

type Params = { q: string };

const fields = 'id,name,author_name,author_id,pic_200';

function response(r) {
  return _.map(r.data, b => ({
    id: `l_${b.id}`,
    title: b.name,
    author: b.author_name,
    authors: [{ id: `l_${b.author_id}`, name: b.author_name }],
    thumbnail: b.pic_200,
    search: b.name,
  }));
}

export default api
  .get<Params>('/books')
  .query(({ q }) => ({ q, andyll: LIVELIB_APIKEY, start: 1, count: 10, fields }))
  .response(response);
