import { FANTLAB_URL, FANTLAB_ROOT_URL, FIREBASE_URL, LIVELIB_URL } from 'services/config';

import fetchChangesSchema from './firebase/fetch-changes';
import pushChangesSchema from './firebase/push-changes';
import removeDeletedSchema from './firebase/remove-deleted';

import searchBooksSchema from './fantlab/search-books';
import bookSchema from './fantlab/book';
import thumbnailsSchema from './fantlab/thumbnails';
import similarSchema from './fantlab/similar';
import reviewListSchema from './fantlab/review-list';
import markWorkSchema from './fantlab/mark-work';
import loginSchema from './fantlab/login';
import editionsSchema from './fantlab/editions';
import reviewVoteSchema from './fantlab/review-vote';
import searchEditionsSchema from './fantlab/search-editions';
import editionSchema from './fantlab/edition';
import worksSchema from './fantlab/works';

import lBooksSearchSchema from './livelib/books-search';
import lBookSchema from './livelib/book';
import lReviewsSchema from './livelib/review-list';

export class API {
  // Firebase
  fetchChanges = fetchChangesSchema.create(FIREBASE_URL);
  pushChanges = pushChangesSchema.create(FIREBASE_URL);
  removeDeleted = removeDeletedSchema.create(FIREBASE_URL);

  // Fantlab
  searchBooks = searchBooksSchema.create(FANTLAB_URL);
  book = bookSchema.create(FANTLAB_URL);
  thumbnails = thumbnailsSchema.create(FANTLAB_URL);
  similar = similarSchema.create(FANTLAB_URL);
  reviewList = reviewListSchema.create(FANTLAB_URL);
  markWork = markWorkSchema.create(FANTLAB_ROOT_URL);
  login = loginSchema.create(FANTLAB_URL);
  edition = editionSchema.create(FANTLAB_URL);
  editions = editionsSchema.create(FANTLAB_URL);
  searchEditions = searchEditionsSchema.create(FANTLAB_URL);
  works = worksSchema.create(FANTLAB_URL);

  reviewVote = reviewVoteSchema.create(FANTLAB_ROOT_URL);

  // LiveLib
  lBooksSearch = lBooksSearchSchema.create(LIVELIB_URL);
  lBook = lBookSchema.create(LIVELIB_URL);
  lReviews = lReviewsSchema.create(LIVELIB_URL);
}

export const api: API = new API();
