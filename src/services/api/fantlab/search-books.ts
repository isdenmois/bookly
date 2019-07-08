import _ from 'lodash';

const DEFAULT_QUERY = { page: 1, onlymatches: 1 };

const THUMBNAIL_URL = 'https://data.fantlab.ru/images/editions/big';

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
  thumbnail: w => (w.pic_edition_id_auto ? `${THUMBNAIL_URL}/${w.pic_edition_id_auto}` : ''),
  author: 'autor_rusname',
  authors: w => [{ id: w.autor_id.toString(), name: w.autor_rusname }],
  type: 'name_eng',
  searchTitles: w => [w.name, w.rusname, w.altname].filter(_.identity).join(';'),
};
