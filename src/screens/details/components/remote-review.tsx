import React, { createRef } from 'react';
import { Text, View, ViewStyle, TextStyle, TouchableOpacity, ToastAndroid, Linking, Platform } from 'react-native';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TabScrollContext, HEADER_HEIGHT } from 'screens/details/tabs/tab';
import { RemoteReview as IRemoteReview } from 'services/api/fantlab/review-list';
import { ExpandableText, Thumbnail } from 'components';
import { formatDate } from 'utils/date';
import { parser } from 'utils/bbcode';
import { dynamicColor, getColor, boldText } from 'types/colors';
import { api } from 'services';
import { confirm } from './book-details-lines';
import { DynamicStyleSheet } from 'react-native-dynamic';

interface Props {
  review: IRemoteReview;
  mode: string;
}

const FANTLAB_USER_URL = 'https://fantlab.ru/user';
const LIVELIB_USER_URL = 'https://www.livelib.ru/reader/';

export class RemoteReview extends React.PureComponent<Props> {
  static contextType = TabScrollContext;
  declare context: React.ContextType<typeof TabScrollContext>;

  state = { likes: this.props.review.likes, isLiked: false };

  rootRef = createRef<View>();

  get isLivelib() {
    const id = this.props.review.id;

    return typeof id === 'string' && id.startsWith('l_');
  }

  render() {
    const { mode, review } = this.props;
    const { isLiked, likes } = this.state;
    const isLivelib = this.isLivelib;
    const LikeComponent: any = !isLivelib && !isLiked ? TouchableOpacity : View;
    const color = getColor(mode);
    const s = ds[mode];

    return (
      <View style={s.container} onLayout={_.noop} ref={this.rootRef}>
        <View style={s.dataRow}>
          <View style={s.mainInfo}>
            <TouchableOpacity style={s.userInfo} onPress={this.openUserPage}>
              <Thumbnail style={s.avatar} url={review.userAvatar} width={32} height={32} title={review.user} />
              <Text style={s.user}>{review.user}</Text>
            </TouchableOpacity>
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

        <ExpandableText onShrink={this.scrollToElement} mode={mode}>
          {parser.toReact(review.body)}
        </ExpandableText>
      </View>
    );
  }

  scrollToElement = () => {
    this.rootRef.current.measureLayout(
      this.context.rootId,
      (left, top) => {
        if (Platform.OS === 'web') top = (this.rootRef.current as any).offsetTop;
        this.context.scrollTo(Math.floor(top) - HEADER_HEIGHT - 15, true);
      },
      _.noop,
    );
  };

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

  openUserPage = () => {
    const prefix = this.isLivelib ? LIVELIB_USER_URL : FANTLAB_USER_URL;
    const URL = prefix + this.props.review.userId;

    Linking.openURL(URL);
  };
}

const ds = new DynamicStyleSheet({
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
    color: dynamicColor.PrimaryText,
    fontSize: 14,
    marginLeft: 10,
    lineHeight: 14,
    ...boldText,
  } as TextStyle,
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  date: {
    color: dynamicColor.SecondaryText,
    fontSize: 12,
    marginLeft: 10,
    lineHeight: 12,
  } as TextStyle,
  rating: {
    color: dynamicColor.PrimaryText,
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
