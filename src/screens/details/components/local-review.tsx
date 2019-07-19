import React from 'react';
import { Text, View, StyleSheet, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { Session, inject } from 'services';
import { BookData } from 'store/book';
import Review from 'store/review';
import { formatDate } from 'utils/date';
import { color } from 'types/colors';
import { TouchIcon } from 'components/touch-icon';

interface Props extends NavigationScreenProps {
  book: BookData;
  review: Review;
}

interface State {
  expanded: boolean;
}

const DEFAULT_BODY_LINES = 3;

export class LocalReview extends React.Component<Props, State> {
  state: State = { expanded: false };
  session = inject(Session);

  render() {
    const review = this.props.review;
    const bodyLines = this.state.expanded ? null : DEFAULT_BODY_LINES;

    return (
      <View style={s.container}>
        <View style={s.dataRow}>
          <View style={s.mainInfo}>
            <Text style={s.user}>{this.session.userId}</Text>
            <Text style={s.date}>{formatDate(review.date)}</Text>
          </View>
          <TouchIcon style={s.icon} name='pen' size={16} color={color.PrimaryText} onPress={this.openEditReview} />
        </View>

        <TouchableOpacity onPress={this.toggleExpanded}>
          <Text style={s.body} numberOfLines={bodyLines}>
            {review.body}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  toggleExpanded = () => this.setState({ expanded: !this.state.expanded });

  openEditReview = () =>
    this.props.navigation.navigate('/modal/review-write', { review: this.props.review, book: this.props.book });
}

const s = StyleSheet.create({
  container: {
    marginTop: 15,
  } as ViewStyle,
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  } as ViewStyle,
  avatar: {
    borderRadius: 16,
  },
  user: {
    fontFamily: 'sans-serif-medium',
    color: color.PrimaryText,
    fontSize: 14,
    marginLeft: 10,
  } as TextStyle,
  date: {
    color: color.SecondaryText,
    fontSize: 12,
    marginLeft: 10,
  } as TextStyle,
  rating: {
    color: color.PrimaryText,
    fontSize: 14,
    marginLeft: 3,
  } as TextStyle,
  icon: {
    marginLeft: 10,
  } as TextStyle,
  body: {
    color: '#454754',
    marginTop: 10,
  } as TextStyle,
});
