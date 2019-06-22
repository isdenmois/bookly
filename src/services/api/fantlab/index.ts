import { FANTLAB_URL } from 'react-native-dotenv';
import { inject } from 'react-ioc';
import { createApi } from '../base';
import { Session } from 'services/session';

import * as searchBooksSchema from './search-books';
import * as bookSchema from './book';

export class FantlabAPI {
  session = inject(this, Session);

  searchBooks = createApi(this, FANTLAB_URL, searchBooksSchema);
  book = createApi(this, FANTLAB_URL, bookSchema);
}
