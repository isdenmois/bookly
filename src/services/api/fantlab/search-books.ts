import _ from 'lodash';
import { api } from '../base/api';

type Params = { q: string };

const response = {
  items: result =>
    _.map(result.matches, (w: any) => ({
      id: String(w.work_id),
      title: w.rusname || w.name,
      thumbnail: String(w.pic_edition_id_auto || w.pic_edition_id || ''),
      author: w.autor_rusname,
      authors: [{ id: String(w.autor_id), name: w.autor_rusname }],
      type: w.name_eng,
      search: [w.name, w.rusname, w.altname].filter(_.identity).join(';'),
    })),
  total: 'total',
};

export default api
  .get<Params>('/search-works')
  .query('q', q => q.trim().replace(/\s+/g, '+'))
  .response(response);
