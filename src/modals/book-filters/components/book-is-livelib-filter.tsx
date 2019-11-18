import React, { useCallback, useMemo } from 'react';
import { Switch, StyleSheet, ViewStyle } from 'react-native';
import { observer } from 'mobx-react';
import { inject } from 'services';
import { ListItem } from 'components';
import { BookFilters } from '../book-filters.service';

interface Props {}

export const BookIsLiveLibFilter = observer(({}: Props) => {
  const filters = useMemo(() => inject(BookFilters), []);
  const toggle = useCallback(() => filters.setFilter('isLiveLib', filters.isLiveLib ? null : true), [filters]);

  return (
    <ListItem rowStyle={s.row} label='Из LiveLib' onPress={toggle}>
      <Switch value={filters.isLiveLib} onValueChange={toggle} />
    </ListItem>
  );
});

const s = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
  } as ViewStyle,
});
