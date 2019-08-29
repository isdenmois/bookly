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

  searchBooks = createApi(this, searchBooksSchema) as searchBooksSchema.Request;
  book = createApi(this, bookSchema) as bookSchema.Request;
  thumbnails = createApi(this, thumbnailsSchema) as thumbnailsSchema.Request;
  similar = createApi(this, similarSchema) as similarSchema.Request;
  reviewList = createApi(this, reviewListSchema) as reviewListSchema.Request;
  markWork = createApi(this, markWorkSchema) as markWorkSchema.Request;
  login = createApi(this, loginSchema) as loginSchema.Request;
  editions = createApi(this, editionsSchema) as editionsSchema.Request;
}
