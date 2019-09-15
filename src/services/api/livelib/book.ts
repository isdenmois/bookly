import { LIVELIB_APIKEY } from 'react-native-dotenv';
import { api } from '../base/api';

type Params = { bookId: string };

const fields = 'id,name,author_name,author_id,pic_200,year,isbn,description,series_title';

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
  };
}

export default api
  .get<Params>('/books/:bookId', true)
  .query(({ bookId }: Params) => ({ bookId: bookId.replace('l_', ''), andyll: LIVELIB_APIKEY, fields }))
  .response(response);
