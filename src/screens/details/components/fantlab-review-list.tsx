import React from 'react';
import _ from 'lodash';
import { Text } from 'react-native';
import { inject } from 'services';
import { FantlabAPI } from 'api';
import { FantlabReview as IFantlabReview, ReviewList } from 'services/api/fantlab/review-list';
import { Fetcher } from 'components';
import { FantlabReview } from './fantlab-review';

interface Props {
  bookId: string;
}

function EmptyResult() {
  return null;
}

export class FantlabReviewList extends React.Component<Props> {
  api = inject(FantlabAPI);

  render() {
    return (
      <Fetcher bookId={this.props.bookId} api={this.api.reviewList} empty={EmptyResult}>
        {this.renderResult}
      </Fetcher>
    );
  }

  renderResult = (data: ReviewList, error) => {
    if (error) {
      return this.renderError(error);
    }

    return _.map(data.items, review => this.renderReview(review));
  };

  renderError(error) {
    return <Text>{JSON.stringify(error)}</Text>;
  }

  renderReview(review: IFantlabReview) {
    return <FantlabReview key={review.id} review={review} />;
  }
}
