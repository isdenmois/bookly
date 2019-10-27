import React from 'react';
import { inject } from 'services';
import { API } from 'api';
import { RemoteReview as IRemoteReview } from 'services/api/fantlab/review-list';
import { Fetcher } from 'components';
import { RemoteReview } from './remote-review';

interface Props {
  bookId: string;
  sort: string;
  type: string;
}

export class FantlabReviewList extends React.Component<Props> {
  api = inject(API);

  render() {
    const api = this.props.type === 'Fantlab' ? this.api.reviewList : this.api.lReviews;

    return (
      <Fetcher api={api} bookId={this.props.bookId} sortBy={this.props.sort}>
        {this.renderReview}
      </Fetcher>
    );
  }

  renderReview = (review: IRemoteReview) => {
    return <RemoteReview key={review.id} review={review} />;
  };
}
