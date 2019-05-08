import { FANTLAB_URL } from 'react-native-dotenv';
import { inject } from 'react-ioc';
import { createApi } from '../base';
import { Session } from 'services/session';

import * as searchBooksSchema from './search-books';

export class FantlabAPI {
  session = inject(this, Session);

  searchBooks = createApi(this, FANTLAB_URL, searchBooksSchema);
}
