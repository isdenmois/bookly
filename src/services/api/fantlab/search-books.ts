import _ from 'lodash';

const DEFAULT_QUERY = { page: 1, onlymatches: 1 };

export const url = '/search-works';

export const collection = 'books';

export function mapParams({ q }) {
  return {
    query: { ...DEFAULT_QUERY, q: q.trim().replace(/s+/g, '+') },
  };
}

export const mapBody = {
  id: 'work_id',
  title: 'rusname',
  thumbnail: w => w.pic_edition_id_auto,
  author: 'autor_rusname',
  authors: w => [{ id: w.autor_id.toString(), name: w.autor_rusname }],
  type: 'name_eng',
  search: w => [w.name, w.rusname, w.altname].filter(_.identity).join(';'),
};
