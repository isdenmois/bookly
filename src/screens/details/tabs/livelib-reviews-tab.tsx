import React, { useCallback } from 'react';
import Book from 'store/book';
import { Fetcher } from 'components';
import { LocalReviewList } from '../components/local-review-list';
import { withScroll } from './tab';
import { AddButton } from './reviews-tab';
import { api } from 'services';
import { RemoteReview } from '../components/remote-review';
import { RemoteReview as IRemoteReview } from 'services/api/fantlab/review-list';

interface Props {
  book: Book;
}

function LivelibReviewsTabComponent(props: Props) {
  const renderReview = useCallback((review: IRemoteReview) => <RemoteReview key={review.id} review={review} />, []);

  return (
    <>
      <LocalReviewList book={props.book} />
      <Fetcher api={api.lReviews} bookId={props.book.id}>
        {renderReview}
      </Fetcher>
    </>
  );
}

export const LivelibReviewsTab = withScroll(LivelibReviewsTabComponent, true);

LivelibReviewsTabComponent.Fixed = AddButton;
