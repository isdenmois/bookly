import _ from 'lodash';
import { api } from '../base/api';

type Params = { q: string };

const response = {
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

export default api
  .get<Params>('/search-works')
  .query('q', q => q.trim().replace(/\s+/g, '+'))
  .response(response);
