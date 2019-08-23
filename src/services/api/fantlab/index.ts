import { FANTLAB_URL } from 'services/config';
import { createApi } from '../base';

import * as searchBooksSchema from './search-books';
import * as bookSchema from './book';
import * as thumbnailsSchema from './thumbnails';
import * as similarSchema from './similar';
import * as reviewListSchema from './review-list';
import * as markWorkSchema from './mark-work';
import * as loginSchema from './login';
import * as editionsSchema from './editions';

export class FantlabAPI {
  baseUrl = FANTLAB_URL;

  searchBooks = createApi(this, searchBooksSchema);
  book = createApi(this, bookSchema);
  thumbnails = createApi(this, thumbnailsSchema);
  similar = createApi(this, similarSchema);
  reviewList = createApi(this, reviewListSchema);
  markWork: markWorkSchema.Request = createApi(this, markWorkSchema);
  login: loginSchema.Request = createApi(this, loginSchema);
  editions = createApi(this, editionsSchema);
}
