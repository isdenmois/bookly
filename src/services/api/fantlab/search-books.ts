import _ from 'lodash';
import { API } from '../base/api';

type Params = { q: string };

const map = {
  items: result =>
    _.map(result.matches, (w: any) => ({
      id: w.work_id.toString(),
      title: w.rusname || w.name,
      thumbnail: w.pic_edition_id_auto,
      author: w.autor_rusname,
      authors: [{ id: w.autor_id.toString(), name: w.autor_rusname }],
      type: w.name_eng,
      search: [w.name, w.rusname, w.altname].filter(_.identity).join(';'),
    })),
  total: 'total',
};

export default (api: API<Params>) =>
  api
    .get('/search-works')
    .query('q', q => q.trim().replace(/\s+/g, '+'))
    .mapBody(map);
