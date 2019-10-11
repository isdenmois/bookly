import React, { useMemo, useCallback } from 'react';
import { Animated, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { color } from 'types/colors';
import Book from 'store/book';
import { Fetcher, Tag } from 'components';
import { LocalReviewList } from '../components/local-review-list';
import { withScroll } from './tab';
import { AddButton } from './reviews-tab';
import { inject } from 'services';
import { API } from 'services/api';
import { RemoteReview } from '../components/remote-review';
import { RemoteReview as IRemoteReview } from 'services/api/fantlab/review-list';

interface Props {
  book: Book;
}

interface SelectReviewSortProps {
  sort: string;
  selected: string;
  title: string;
  setSort: (sort: string) => void;
}

function LivelibReviewsTabComponent(props: Props) {
  const api = useMemo(() => inject(API), []);
  const renderReview = useCallback((review: IRemoteReview) => <RemoteReview key={review.id} review={review} />);

  return (
    <>
      <LocalReviewList book={props.book} />
      <Fetcher api={api.lReviews} bookId={props.book.id}>
        {renderReview}
      </Fetcher>
    </>
  );
}

export const LivelibReviewsTab = withScroll(LivelibReviewsTabComponent);

LivelibReviewsTabComponent.Fixed = AddButton;
