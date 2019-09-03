import { FANTLAB_URL, FANTLAB_LOGIN_URL } from 'services/config';

import searchBooksSchema from './search-books';
import bookSchema from './book';
import thumbnailsSchema from './thumbnails';
import similarSchema from './similar';
import reviewListSchema from './review-list';
import markWorkSchema from './mark-work';
import loginSchema from './login';
import editionsSchema from './editions';

export class FantlabAPI {
  searchBooks = searchBooksSchema.create(FANTLAB_URL);
  book = bookSchema.create(FANTLAB_URL);
  thumbnails = thumbnailsSchema.create(FANTLAB_URL);
  similar = similarSchema.create(FANTLAB_URL);
  reviewList = reviewListSchema.create(FANTLAB_URL);
  markWork = markWorkSchema.create(FANTLAB_LOGIN_URL);
  login = loginSchema.create(FANTLAB_URL);
  editions = editionsSchema.create(FANTLAB_URL);
}
