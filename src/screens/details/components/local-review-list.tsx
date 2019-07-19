import React from 'react';
import _ from 'lodash';
import { NavigationScreenProps } from 'react-navigation';
import withObservables from '@nozbe/with-observables';
import Review from 'store/review';
import Book from 'store/book';
import { LocalReview } from './local-review';

interface Props extends NavigationScreenProps {
  book: Book;
  reviews?: Review[];
}

@withObservables(['book'], ({ book }: Props) => ({
  reviews: book.reviews.observeWithColumns(['body']),
}))
export class LocalReviewList extends React.Component<Props> {
  render() {
    return _.map(this.props.reviews, review => (
      <LocalReview key={review.id} book={this.props.book} review={review} navigation={this.props.navigation} />
    ));
  }
}
