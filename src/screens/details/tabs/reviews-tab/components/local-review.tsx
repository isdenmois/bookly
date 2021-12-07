import React, { useCallback } from 'react';
import { Text, View, ViewStyle, TextStyle } from 'react-native';
import { DynamicStyleSheet } from 'react-native-dynamic';

import { openModal, settings } from 'services';
import { BookData } from 'store/book';
import Review from 'store/review';
import { formatDate } from 'utils/date';
import { dynamicColor, boldText, useSColor } from 'types/colors';
import { ExpandableText, TouchIcon } from 'components';

import { confirmRemoveModel } from '../../details-tab/book-details-lines';
import { ModalRoutes } from 'navigation/routes';

interface Props {
  book: BookData;
  review: Review;
}

const navigate = (review, book) => openModal(ModalRoutes.ReviewWrite, { review, book });

export function LocalReview({ review, book }: Props) {
  const { s, color } = useSColor(ds);
  const openEditReview = useCallback(() => navigate(review, book), []);
  const deleteReview = useCallback(() => confirmRemoveModel(review, 'удалить отзыв'), []);

  return (
    <View style={s.container}>
      <View style={s.dataRow}>
        <View style={s.mainInfo}>
          <Text style={s.user}>{settings.userId}</Text>
          <Text style={s.date}>{formatDate(review.date)}</Text>
        </View>
        <TouchIcon style={s.icon} name='times' size={24} color={color.ErrorText} onPress={deleteReview} />
        <TouchIcon style={s.icon} name='pen' size={16} color={color.PrimaryText} onPress={openEditReview} />
      </View>

      <ExpandableText>{review.body}</ExpandableText>
    </View>
  );
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
    ...boldText,
  } as TextStyle,
  date: {
    color: dynamicColor.SecondaryText,
    fontSize: 12,
    marginLeft: 10,
  } as TextStyle,
  rating: {
    color: dynamicColor.PrimaryText,
    fontSize: 14,
    marginLeft: 3,
  } as TextStyle,
  icon: {
    marginLeft: 20,
  } as TextStyle,
});
