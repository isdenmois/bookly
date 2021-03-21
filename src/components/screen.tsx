import React from 'react';
import { DynamicStyleSheet, useDynamicValue, DynamicValue } from 'react-native-dynamic';
import { color, dark } from 'types/colors';
import { Platform, View } from 'react-native';

export function Screen({ children, testID }: { children: any; testID?: string }) {
  const s = useDynamicValue(ds);

  return (
    <View style={s.root} testID={testID}>
      {children}
    </View>
  );
}

const ds = new DynamicStyleSheet({
  root: {
    flex: 1,
    backgroundColor: new DynamicValue(color.Background, dark.Background),
    marginBottom: Platform.OS === 'web' ? 20 : 0,
  },
});
