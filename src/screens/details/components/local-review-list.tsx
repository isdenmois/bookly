import React from 'react';
import _ from 'lodash';
import withObservables from '@nozbe/with-observables';
import Review from 'store/review';
import Book from 'store/book';
import { LocalReview } from './local-review';

interface Props {
  book: Book;
  reviews?: Review[];
  mode: string;
}

const withReviews: Function = withObservables(['book'], ({ book }: Props) =>
  book.reviews
    ? {
        reviews: book.reviews.observeWithColumns(['body']),
      }
    : {},
);

@withReviews
export class LocalReviewList extends React.Component<Props> {
  render() {
    return _.map(this.props.reviews, review => (
      <LocalReview key={review.id} book={this.props.book} review={review} mode={this.props.mode} />
    ));
  }
}
