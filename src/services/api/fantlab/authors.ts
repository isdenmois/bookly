import _ from 'lodash';
import { api } from '../base/api';

export type Params = { q: string };

function response(data) {
  const authors = _.find(data, m => m.type === 'autors') || {};

  if (authors.matches?.length) {
    return authors.matches.map(a => ({ id: a.autor_id.toString(), name: a.rusname || a.name, add: createAdd(a) }));
  }

  const works = _.find(data, m => m.type === 'works') || {};

  if (works.matches?.length) {
    return _.uniqBy<any>(works.matches, 'autor_id')
      .filter(a => a.autor_id)
      .map(a => ({ id: a.autor_id.toString(), name: a.autor_rusname }));
  }

  return [];
}

function createAdd(author) {
  const res = [];

  if (author.country) {
    res.push(author.country);
  }

  if (author.birthyear) {
    if (author.deathyear) {
      res.push(`${author.birthyear}-${author.deathyear}`);
    } else {
      res.push(author.birthyear);
    }
  }

  return res.join(', ');
}

export default api
  .get<Params>('/searchmain')
  .query('q', q => q.trim().replace(/\s+/g, '+'))
  .response(response);
