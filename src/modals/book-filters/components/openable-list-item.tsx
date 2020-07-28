import React, { useState, useEffect } from 'react';
import { Text, TextStyle, View, TouchableOpacity } from 'react-native';
import { DynamicStyleSheet, useDynamicValue } from 'react-native-dynamic';
import { t } from 'services';
import { dynamicColor } from 'types/colors';
import { ListItem } from 'components';

interface Props {
  title: string;
  viewValue: string;
  children?: React.ReactChild;
  onClear: () => void;
  onClose?: () => void;
}

export function OpenableListItem({ title, viewValue, children, onClear, onClose }: Props) {
  const [opened, setOpened] = useState(false);
  const s = useDynamicValue(ds);

  useEffect(() => {
    setOpened(false);
  }, [viewValue]);

  const open = () => setOpened(true);
  const close = () => {
    setOpened(false);
    onClose?.();
  };
  const defined = Boolean(viewValue);

  return (
    <ListItem onPress={opened ? null : open} value={viewValue} clearable={defined && !opened} onChange={onClear}>
      {!opened && <Text style={s.title}>{t(title)}</Text>}
      {opened && (
        <View style={s.container}>
          <TouchableOpacity onPress={close}>
            <Text style={s.title}>{t(title)}</Text>
          </TouchableOpacity>

          {children}
        </View>
      )}
      {defined && !opened && <Text style={s.value}>{viewValue}</Text>}
    </ListItem>
  );
}

const ds = new DynamicStyleSheet({
  title: {
    fontSize: 16,
    color: dynamicColor.PrimaryText,
  } as TextStyle,
  container: {
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: dynamicColor.PrimaryText,
    flex: 1,
    textAlign: 'right',
  } as TextStyle,
});
