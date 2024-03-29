import React, { FC, useCallback } from 'react';
import { api } from 'services';
import { RemoteReview as IRemoteReview } from 'services/api/fantlab/review-list';
import { Fetcher } from 'components';
import { RemoteReview } from './remote-review';

interface Props {
  bookId: string;
  sort: string;
  type: string;
}

export const FantlabReviewList: FC<Props> = ({ bookId, sort, type }) => {
  const apiProp = type === 'Fantlab' ? api.reviewList : api.lReviews;
  const renderReview = useCallback((review: IRemoteReview) => <RemoteReview key={review.id} review={review} />, []);

  return (
    <Fetcher api={apiProp} bookId={bookId} sortBy={sort}>
      {renderReview}
    </Fetcher>
  );
};
