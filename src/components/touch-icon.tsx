import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import Icon, { FontAwesome5IconProps } from 'react-native-vector-icons/FontAwesome5';

type Props = FontAwesome5IconProps & {
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  paddingLeft?: number;
  onPress: () => void;
};

export function TouchIcon({ padding, paddingHorizontal, paddingVertical, paddingLeft, onPress, ...props }: Props) {
  const style: ViewStyle = {};

  if (padding) {
    style.padding = padding;
  }

  if (paddingHorizontal) {
    style.paddingHorizontal = paddingHorizontal;
  }

  if (paddingVertical) {
    style.paddingVertical = paddingVertical;
  }

  if (paddingLeft) {
    style.paddingLeft = paddingLeft;
  }

  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Icon {...props} />
    </TouchableOpacity>
  );
}
