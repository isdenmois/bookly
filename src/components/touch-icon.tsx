import React from 'react';
import { Insets, TouchableOpacity, ViewStyle } from 'react-native';
import Icon, { FontAwesome5IconProps } from 'react-native-vector-icons/FontAwesome5';

type Props = FontAwesome5IconProps & {
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  paddingLeft?: number;
  onPress: () => void;
};

const hitSlop: Insets = { top: 20, right: 20, bottom: 20, left: 20 };

export function TouchIcon({
  padding,
  paddingHorizontal,
  paddingVertical,
  paddingLeft,
  onPress,
  onLongPress,
  ...props
}: Props) {
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
    <TouchableOpacity style={style} onPress={onPress} onLongPress={onLongPress} hitSlop={hitSlop}>
      <Icon {...props} />
    </TouchableOpacity>
  );
}
