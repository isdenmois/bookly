import _ from 'lodash';

export const url = '/search-works';

export const collection = 'books';

export function mapParams({ q, page }) {
  return {
    query: { page, q: q.trim().replace(/\s+/g, '+') },
  };
}

export const mapBody = {
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

export type Request = (p: { q: string }) => Promise<any>;
