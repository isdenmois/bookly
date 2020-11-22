import React, { useCallback } from 'react';
import { StyleSheet, ViewStyle, View } from 'react-native';
import { formatRating } from 'components/rating';
import { SwipeRating } from 'components';
import { OpenableListItem } from './openable-list-item';
import { useFormState } from 'utils/form';

export function BookRatingFilter() {
  const [rating, setRating] = useFormState('rating');
  const clear = useCallback(() => setRating(null), []);

  return (
    <OpenableListItem title='modal.rating' viewValue={formatRating(rating)} onClear={clear}>
      <View style={s.row}>
        <SwipeRating value={rating} onChange={setRating} />
      </View>
    </OpenableListItem>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flex: 1,
  } as ViewStyle,
});
