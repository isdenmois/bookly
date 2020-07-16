import React from 'react';
import { api } from 'services';
import { RemoteReview as IRemoteReview } from 'services/api/fantlab/review-list';
import { Fetcher } from 'components';
import { RemoteReview } from './remote-review';

interface Props {
  bookId: string;
  sort: string;
  type: string;
  mode: string;
}

export class FantlabReviewList extends React.Component<Props> {
  render() {
    const apiProp = this.props.type === 'Fantlab' ? api.reviewList : api.lReviews;

    return (
      <Fetcher api={apiProp} bookId={this.props.bookId} sortBy={this.props.sort}>
        {this.renderReview}
      </Fetcher>
    );
  }

  renderReview = (review: IRemoteReview) => {
    return <RemoteReview key={review.id} review={review} mode={this.props.mode} />;
  };
}
