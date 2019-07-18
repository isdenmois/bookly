import React from 'react';
import { ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { FantlabReviewList } from '../components/fantlab-review-list';

interface Props {
  bookId: string;
}

export class ReviewsTab extends React.PureComponent<Props> {
  render() {
    return (
      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}>
        <FantlabReviewList bookId={this.props.bookId} />
      </ScrollView>
    );
  }
}

const s = StyleSheet.create({
  scroll: {
    flex: 1,
  } as ViewStyle,
  scrollContent: {
    padding: 15,
  } as ViewStyle,
});
