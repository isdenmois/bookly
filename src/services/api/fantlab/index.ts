import { FANTLAB_URL } from 'react-native-dotenv';
import { inject } from 'react-ioc';
import { createApi } from '../base';
import { Session } from 'services/session';

import * as searchBooksSchema from './search-books';
import * as bookSchema from './book';
import * as thumbnailsSchema from './thumbnails';
import * as similarSchema from './similar';
import * as reviewListSchema from './review-list';

export class FantlabAPI {
  baseUrl = FANTLAB_URL;
  session = inject(this, Session);

  searchBooks = createApi(this, searchBooksSchema);
  book = createApi(this, bookSchema);
  thumbnails = createApi(this, thumbnailsSchema);
  similar = createApi(this, similarSchema);
  reviewList = createApi(this, reviewListSchema);
}
