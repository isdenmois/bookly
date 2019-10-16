import { LIVELIB_APIKEY } from 'react-native-dotenv';
import { api } from '../base/api';

type Params = { bookId: string };

const fields = 'author_id,author_name,name,pic_200,id,description,isbn,publishing,year,series_title,tags';

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
  publishing?: string;
  tags?: string;
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
    tags: (r.tags || '')
      .split(',')
      .filter(t => t)
      .map(capitalize)
      .join('\n'),
  };
}

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

export default api
  .get<Params>('/books/:bookId', true)
  .query(({ bookId }: Params) => ({ bookId: bookId.replace('l_', ''), andyll: LIVELIB_APIKEY, fields }))
  .response(response);
