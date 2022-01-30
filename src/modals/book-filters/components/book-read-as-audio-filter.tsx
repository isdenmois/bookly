import React, { useCallback } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { ListItem, Checkbox } from 'components';
import { useFormState } from '../book-filters.form';

export function BookReadAsAudioFilter() {
  const [audio, setFilter, { form }] = useFormState('audio');
  const toggle = useCallback(() => setFilter(form.audio ? null : 'y'), []);

  return (
    <ListItem rowStyle={s.row} label='common.read-as-audio' onPress={toggle}>
      <Checkbox value={audio === 'y'} onValueChange={toggle} />
    </ListItem>
  );
}

const s = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
  } as ViewStyle,
});
