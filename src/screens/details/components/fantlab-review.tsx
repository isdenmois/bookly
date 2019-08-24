import React from 'react';
import { Text, View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { FantlabReview as IFantlabReview } from 'services/api/fantlab/review-list';
import { ExpandableText, Thumbnail } from 'components';
import { formatDate } from 'utils/date';
import { parser } from 'utils/bbcode';
import { color } from 'types/colors';

interface Props {
  review: IFantlabReview;
}

export class FantlabReview extends React.PureComponent<Props> {
  render() {
    const review = this.props.review;

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

        <ExpandableText>{parser.toReact(review.body)}</ExpandableText>
      </View>
    );
  }
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
});
