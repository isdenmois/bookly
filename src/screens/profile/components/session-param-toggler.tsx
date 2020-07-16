import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { ViewStyle, StyleSheet } from 'react-native';
import { session } from 'services';
import { Checkbox, ListItem } from 'components';
import { Setting } from 'services/session';

interface Props {
  title: string;
  param: Setting;
}

export const SessionParamToggler = observer(({ title, param }: Props) => {
  const toggle = useCallback(() => session.set(param, !session[param]), []);
  const value = !!session[param];

  return (
    <ListItem style={s.container} rowStyle={s.row} label={title} onPress={toggle}>
      <Checkbox value={value} onValueChange={toggle} />
    </ListItem>
  );
});

const s = StyleSheet.create({
  container: {
    width: 'auto',
  } as ViewStyle,
  row: {
    justifyContent: 'space-between',
  } as ViewStyle,
});
