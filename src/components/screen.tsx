import React from 'react';
import { DynamicStyleSheet, useDynamicValue, DynamicValue } from 'react-native-dynamic';
import { color, dark } from 'types/colors';
import { View } from 'react-native';

export function Screen({ children }) {
  const s = useDynamicValue(ds);

  return <View style={s.root}>{children}</View>;
}

const ds = new DynamicStyleSheet({
  root: {
    flex: 1,
    backgroundColor: new DynamicValue(color.Background, dark.Background),
  },
});
