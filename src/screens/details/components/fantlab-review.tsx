import React from 'react';
import { Text, View, StyleSheet, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { FantlabReview as IFantlabReview } from 'services/api/fantlab/review-list';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Thumbnail } from 'components';
import { formatDate } from 'utils/date';
import { color } from 'types/colors';
import parser from 'bbcode-to-react';
interface Props {
  review: IFantlabReview;
}

interface State {
  expanded: boolean;
}

const DEFAULT_BODY_LINES = 3;

export class FantlabReview extends React.Component<Props, State> {
  state: State = { expanded: false };

  render() {
    const review = this.props.review;
    const bodyLines = this.state.expanded ? null : DEFAULT_BODY_LINES;

    return (
      <View style={s.container}>
        <View style={s.dataRow}>
          <View style={s.mainInfo}>
            <Thumbnail
              style={s.avatar}
              url={review.userAvatar}
              width={32}
              height={32}
              title={review.user}
              auto='none'
            />
            <Text style={s.user}>{review.user}</Text>
            <Text style={s.date}>{formatDate(review.date)}</Text>
          </View>
          <Icon style={s.icon} name='star' size={16} color={color.PrimaryText} />
          <Text style={s.rating}>{review.rating}</Text>
          <Icon style={s.icon} name='heart' size={16} color={color.PrimaryText} />
          <Text style={s.rating}>{review.likes}</Text>
        </View>

        <Text style={s.body} numberOfLines={bodyLines}>
          {parser.toReact(review.body)}
        </Text>

        <TouchableOpacity onPress={this.toggleExpanded}>
          <Text style={s.toggleText}>{this.state.expanded ? 'Свернуть' : 'Читать далее'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  toggleExpanded = () => this.setState({ expanded: !this.state.expanded });
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
    color: color.Review,
    marginTop: 10,
  } as TextStyle,
  toggleText: {
    paddingVertical: 5,
    textAlign: 'right',
    color: color.ReadMore,
  } as TextStyle,
});
