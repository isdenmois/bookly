import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { light, dark } from 'types/colors';
import { TextXL } from 'components/text';
import { DynamicStyleSheet, useDynamicValue, DynamicValue } from 'react-native-dynamic';

interface Props {
  value: string | number;
  label: string;
  testID?: string;
}

export function Counter(props: Props) {
  const s = useDynamicValue(ds);

  return (
    <View style={s.container}>
      <TextXL style={s.value} testID={props.testID}>
        {props.value}
      </TextXL>
      <Text style={s.label}>{props.label}</Text>
    </View>
  );
}

const ds = new DynamicStyleSheet({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
  } as ViewStyle,
  value: {
    color: new DynamicValue(light.PrimaryText, dark.PrimaryText),
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  label: {
    color: new DynamicValue(light.PrimaryText, dark.PrimaryText),
    fontSize: 14,
  },
});
