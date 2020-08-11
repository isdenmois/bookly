import { LIVELIB_APIKEY } from 'services/config';
import { ParentBook } from 'types/book-extended';
import { api } from '../base/api';

type Params = { bookId: string };

const fields =
  'author_id,author_name,name,avg_mark,pic_200,id,description,isbn,publishing,year,cycles,series_title,tags';

export interface LiveLibBook {
  id: string;
  title: string;
  author: string;
  authors: any[];
  search: string;
  type: string;
  thumbnail?: string;
  year?: number;
  isbn?: string;
  description?: string;
  series?: string;
  cycles?: ParentBook[];
  publishing?: string;
  tags?: string;
  avgRating?: string;
}

function response(r): LiveLibBook {
  r = r.data;

  return {
    id: `l_${r.id}`,
    title: r.name,
    author: r.author_name,
    authors: [{ id: `l_${r.author_id}`, name: r.author_name }],
    thumbnail: r.pic_200,
    search: r.name,
    type: 'novel',
    year: r.year,
    isbn: r.isbn,
    description: r.description,
    series: r.series_title,
    publishing: r.publishing,
    cycles: (r.cycles || []).map(c => ({
      id: `l_${c.id}`,
      title: c.title,
      type: c.category_name,
    })),
    tags: (r.tags || '')
      .split(',')
      .filter(t => t)
      .map(capitalize)
      .join('\n'),
    avgRating: avgRating(r.avg_mark),
  };
}

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

function avgRating(rating) {
  if (!rating) return null;

  rating = Math.round(rating * 10) / 10;

  return `${rating} / 10`;
}

export default api
  .get<Params>('/books/:bookId', true)
  .query(({ bookId }: Params) => ({ bookId: bookId.replace('l_', ''), andyll: LIVELIB_APIKEY, fields }))
  .response(response);
