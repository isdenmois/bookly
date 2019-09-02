import { FANTLAB_URL } from 'services/config';
import { createApi, createApi2 } from '../base';

import searchBooksSchema from './search-books';
import bookSchema from './book';
import * as thumbnailsSchema from './thumbnails';
import * as similarSchema from './similar';
import * as reviewListSchema from './review-list';
import * as markWorkSchema from './mark-work';
import * as loginSchema from './login';
import * as editionsSchema from './editions';

export class FantlabAPI {
  searchBooks = createApi2(FANTLAB_URL, searchBooksSchema);
  book = createApi2(FANTLAB_URL, bookSchema);
  thumbnails = createApi(FANTLAB_URL, thumbnailsSchema);
  similar = createApi(FANTLAB_URL, similarSchema);
  reviewList = createApi(FANTLAB_URL, reviewListSchema);
  markWork = createApi(FANTLAB_URL, markWorkSchema);
  login = createApi(FANTLAB_URL, loginSchema);
  editions = createApi(FANTLAB_URL, editionsSchema);
}
