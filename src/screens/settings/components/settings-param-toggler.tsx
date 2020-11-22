import React, { useCallback } from 'react';
import { ViewStyle, StyleSheet } from 'react-native';
import { Checkbox, ListItem } from 'components';
import { Setting } from 'services/settings';
import { settings, useSetting } from 'services/settings';

interface Props {
  title: string;
  param: Setting;
}

export function SettingsParamToggler({ title, param }: Props) {
  const value = useSetting(param);
  const toggle = useCallback(() => settings.set(param, !settings[param]), []);

  return (
    <ListItem style={s.container} rowStyle={s.row} label={title} onPress={toggle}>
      <Checkbox value={value} onValueChange={toggle} />
    </ListItem>
  );
}

const s = StyleSheet.create({
  container: {
    width: 'auto',
  } as ViewStyle,
  row: {
    justifyContent: 'space-between',
  } as ViewStyle,
});
