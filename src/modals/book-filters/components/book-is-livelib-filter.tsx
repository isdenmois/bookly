import React, { useCallback } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { observer } from 'mobx-react';
import { ListItem, Checkbox } from 'components';
import { BookFilters } from '../book-filters.service';

interface Props {
  filters: BookFilters;
}

export const BookIsLiveLibFilter = observer(({ filters }: Props) => {
  const toggle = useCallback(() => filters.setFilter('isLiveLib', filters.isLiveLib ? null : true), [filters]);

  return (
    <ListItem rowStyle={s.row} label='common.fromll' onPress={toggle}>
      <Checkbox value={filters.isLiveLib} onValueChange={toggle} />
    </ListItem>
  );
});

const s = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
  } as ViewStyle,
});
