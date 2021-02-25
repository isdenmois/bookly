import React, { useCallback } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { ListItem, Checkbox } from 'components';
import { useFormState } from '../book-filters.form';

export function BookIsLiveLibFilter() {
  const [isLiveLib, setFilter, { form }] = useFormState('isLiveLib');
  const toggle = useCallback(() => setFilter(form.isLiveLib ? null : true), []);

  return (
    <ListItem rowStyle={s.row} label='common.fromll' onPress={toggle}>
      <Checkbox value={isLiveLib} onValueChange={toggle} />
    </ListItem>
  );
}

const s = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
  } as ViewStyle,
});
