import _ from 'lodash';
import { api } from '../base/api';

type Params = { w: string };
export default api
  .get<Params>('/search-ids')
  .query('w')
  .response(obj => works(obj.works));

function works(ws) {
  console.log('ws.length', ws.length);
  return _.map(ws, w => ({
    id: w.id.toString(),
    title: w.name || w.name_orig,
    thumbnail: w.image ? `https://${w.image}` : null,
    author: _.map(w.creators?.authors, 'name').join(', '),
    authors: _.map(w.creators?.authors, a => ({ id: a.id.toString(), name: a.name })),
    type: w.name_type_icon,
    search: [w.name, w.name_orig, w.altname].filter(_.identity).join(';'),
  }));
}
