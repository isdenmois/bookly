import React, { memo } from 'react';
import { times } from 'rambdax';
import { View, ViewStyle, TextStyle } from 'react-native';
import { DynamicStyleSheet, useDynamicValue } from 'react-native-dynamic';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { dynamicColor } from 'types/colors';
import { TextM } from 'components/text';

const SIZE = 10;

interface Props {
  value: number;
  size?: number;
  style?: ViewStyle;
  onChange?: (value: number) => void;
}

export const RatingSelect = memo(({ size = SIZE, value, style, onChange }: Props) => {
  const s = useDynamicValue(ds);

  return (
    <View style={[s.container, style]}>
      {times(index => (
        <Icon
          testID={`star-${index}`}
          key={index}
          style={s.star}
          name='star'
          size={20}
          solid={index < value}
          onPress={() => onChange(index + 1)}
        />
      ))(size)}
      <TextM style={s.text}>{value}</TextM>
    </View>
  );
});

const ds = new DynamicStyleSheet({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  star: {
    color: dynamicColor.Stars,
  } as TextStyle,
  text: {
    color: dynamicColor.PrimaryText,
    marginLeft: 10,
  } as TextStyle,
});
