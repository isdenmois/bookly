import React from 'react';
import { inject } from 'services';
import { FantlabAPI } from 'api';
import { FantlabReview as IFantlabReview } from 'services/api/fantlab/review-list';
import { Fetcher } from 'components';
import { FantlabReview } from './fantlab-review';

interface Props {
  bookId: string;
  sort: string;
}

export class FantlabReviewList extends React.Component<Props> {
  api = inject(FantlabAPI);

  render() {
    return (
      <Fetcher api={this.api.reviewList} bookId={this.props.bookId} sortBy={this.props.sort}>
        {this.renderReview}
      </Fetcher>
    );
  }

  renderReview = (review: IFantlabReview) => {
    return <FantlabReview key={review.id} review={review} />;
  };
}
