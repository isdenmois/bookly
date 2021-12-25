import React, { memo, useRef, useState } from 'react';
import { Text, View, ViewStyle, TextStyle, TouchableOpacity, ToastAndroid, Linking, Platform } from 'react-native';
import _ from 'lodash';
import { DynamicStyleSheet } from 'react-native-dynamic';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { useCoordinator } from 'components/coordinator/coordinator-context';
import { RemoteReview as IRemoteReview } from 'services/api/fantlab/review-list';
import { ExpandableText, Thumbnail } from 'components';
import { formatDate } from 'utils/date';
import { parser } from 'utils/bbcode';
import { dynamicColor, boldText, useSColor } from 'types/colors';
import { api } from 'services';
import { confirm } from '../../details-tab/book-details-lines';

interface Props {
  review: IRemoteReview;
}

const FANTLAB_USER_URL = 'https://fantlab.ru/user';
const LIVELIB_USER_URL = 'https://www.livelib.ru/reader/';

export const RemoteReview = memo<Props>(({ review }) => {
  const { s, color } = useSColor(ds);
  const rootRef = useRef<any>();
  const scrollContext = useCoordinator();

  const [isLiked, setIsLiked] = useState(false);
  const likes = isLiked ? review.likes + 1 : review.likes;
  const isLivelib = isReviewFromLiveLib(review);
  const LikeComponent: any = !isLivelib && !isLiked ? TouchableOpacity : View;

  const openUserPage = () => {
    const prefix = isLivelib ? LIVELIB_USER_URL : FANTLAB_USER_URL;

    Linking.openURL(prefix + review.userId);
  };

  const vote = async () => {
    await confirm('Вы действительно хотите поставить лайк этому отзыву?');

    try {
      setIsLiked(true);

      await api.reviewVote(review.id.replace(/^f_/, ''));

      ToastAndroid.show('Лайк поставлен', ToastAndroid.SHORT);
    } catch (e) {
      setIsLiked(false);

      console.error(e);

      ToastAndroid.show('Не удалось поставить лайк', ToastAndroid.SHORT);
    }
  };

  const scrollToElement = () => {
    if (Platform.OS === 'web') {
      const commentTop = rootRef.current.offsetTop + rootRef.current.offsetParent.offsetParent.offsetTop;
      scrollContext.scrollTo(commentTop, true);
    } else {
      rootRef.current?.measureLayout(
        scrollContext.getRoot(),
        (left, top) => {
          scrollContext.scrollTo(Math.floor(top - scrollContext.headerHeight / 2), true);
        },
        _.noop,
      );
    }
  };

  return (
    <View style={s.container} onLayout={_.noop} ref={rootRef}>
      <View style={s.dataRow}>
        <View style={s.mainInfo}>
          <TouchableOpacity style={s.userInfo} onPress={openUserPage}>
            <Thumbnail style={s.avatar} url={review.userAvatar} width={32} height={32} title={review.user} />
            <Text style={s.user}>{review.user}</Text>
          </TouchableOpacity>
          <Text style={s.date}>{isLivelib ? review.date : formatDate(review.date)}</Text>
        </View>
        <Icon style={s.icon} name='star' size={16} color={color.PrimaryText} />
        <Text style={s.rating}>{review.rating}</Text>

        <LikeComponent style={s.like} onPress={vote}>
          <Icon style={s.icon} name='heart' size={16} color={isLiked ? color.Red : color.PrimaryText} solid={isLiked} />
          <Text style={s.rating}>{likes}</Text>
        </LikeComponent>
      </View>

      <ExpandableText onShrink={scrollToElement}>{parser.toReact(review.body)}</ExpandableText>
    </View>
  );
});

const isReviewFromLiveLib = (review: IRemoteReview): boolean => {
  return typeof review.id === 'string' && review.id.startsWith('l_');
};

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
