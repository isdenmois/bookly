import React from 'react';
import { StyleSheet, ViewStyle, View } from 'react-native';
import { observer } from 'mobx-react';
import { formatRating } from 'components/rating';
import { SwipeRating } from 'components';
import { OpenableListItem } from './openable-list-item';

export const BookRatingFilter = observer(({ filters }) => {
  const setRating = React.useCallback(value => filters.setFilter('rating', value), [filters]);
  const clear = React.useCallback(() => filters.setFilter('rating', null), [filters]);

  return (
    <OpenableListItem title='modal.rating' viewValue={formatRating(filters.rating)} onClear={clear}>
      <View style={s.row}>
        <SwipeRating value={filters.rating} onChange={setRating} />
      </View>
    </OpenableListItem>
  );
});

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flex: 1,
  } as ViewStyle,
});
