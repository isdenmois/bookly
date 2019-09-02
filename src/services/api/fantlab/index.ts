import { FANTLAB_URL } from 'services/config';
import { createApi } from '../base';

import searchBooksSchema from './search-books';
import bookSchema from './book';
import thumbnailsSchema from './thumbnails';
import similarSchema from './similar';
import reviewListSchema from './review-list';
import markWorkSchema from './mark-work';
import loginSchema from './login';
import editionsSchema from './editions';

export class FantlabAPI {
  searchBooks = createApi(FANTLAB_URL, searchBooksSchema);
  book = createApi(FANTLAB_URL, bookSchema);
  thumbnails = createApi(FANTLAB_URL, thumbnailsSchema);
  similar = createApi(FANTLAB_URL, similarSchema);
  reviewList = createApi(FANTLAB_URL, reviewListSchema);
  markWork = createApi(FANTLAB_URL, markWorkSchema);
  login = createApi(FANTLAB_URL, loginSchema);
  editions = createApi(FANTLAB_URL, editionsSchema);
}
