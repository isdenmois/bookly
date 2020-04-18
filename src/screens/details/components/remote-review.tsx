import React from 'react';
import { Text, View, StyleSheet, ViewStyle, TextStyle, TouchableOpacity, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { RemoteReview as IRemoteReview } from 'services/api/fantlab/review-list';
import { ExpandableText, Thumbnail } from 'components';
import { formatDate } from 'utils/date';
import { parser } from 'utils/bbcode';
import { color } from 'types/colors';
import { api } from 'services';
import { confirm } from './book-details-lines';

interface Props {
  review: IRemoteReview;
}

export class RemoteReview extends React.PureComponent<Props> {
  state = { likes: this.props.review.likes, isLiked: false };

  get isLivelib() {
    const id = this.props.review.id;

    return typeof id === 'string' && id.startsWith('l_');
  }

  render() {
    const review = this.props.review;
    const { isLiked, likes } = this.state;
    const isLivelib = this.isLivelib;
    const LikeComponent: any = !isLivelib && !isLiked ? TouchableOpacity : View;

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
            <Text style={s.date}>{isLivelib ? review.date : formatDate(review.date)}</Text>
          </View>
          <Icon style={s.icon} name='star' size={16} color={color.PrimaryText} />
          <Text style={s.rating}>{review.rating}</Text>

          <LikeComponent style={s.like} onPress={this.vote}>
            <Icon
              style={s.icon}
              name='heart'
              size={16}
              color={isLiked ? color.Red : color.PrimaryText}
              solid={isLiked}
            />
            <Text style={s.rating}>{likes}</Text>
          </LikeComponent>
        </View>

        <ExpandableText>{parser.toReact(review.body)}</ExpandableText>
      </View>
    );
  }

  vote = async () => {
    const oldLikes = this.state.likes;

    await confirm('Вы действительно хотите поставить лайк этому отзыву?');

    try {
      this.setState({ isLiked: true, likes: oldLikes + 1 });

      await api.reviewVote(this.props.review.id.replace(/^f_/, ''));

      ToastAndroid.show('Лайк поставлен', ToastAndroid.SHORT);
    } catch (e) {
      this.setState({ isLiked: false, likes: oldLikes });

      console.error(e);

      ToastAndroid.show('Не удалось поставить лайк', ToastAndroid.SHORT);
    }
  };
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
  like: {
    flexDirection: 'row',
  } as ViewStyle,
});
