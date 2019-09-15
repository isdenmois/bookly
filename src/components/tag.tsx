import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { color } from 'types/colors';

interface Props {
  title: string;
  selected?: boolean;
  outline?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
}

function TagComponent({ title, selected, outline, onRemove, onPress }: Props) {
  const Wrapper: any = onRemove || (onPress && !selected) ? TouchableOpacity : View;
  const wraperStyle = [s.wrapper, outline ? s.outline : null, selected ? s.selected : null];

  return (
    <Wrapper style={wraperStyle} onPress={onRemove || onPress}>
      <Text style={s.text}>{title}</Text>
      {!!onRemove && <Icon style={s.icon} name='times' size={14} color={color.Review} />}
    </Wrapper>
  );
}

export const Tag = React.memo(TagComponent);

const s = StyleSheet.create({
  wrapper: {
    backgroundColor: color.LightBackground,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  outline: {
    backgroundColor: null,
    borderColor: color.LightBackground,
    borderWidth: 1,
  } as ViewStyle,
  selected: {
    backgroundColor: color.LightBackground,
  } as ViewStyle,
  text: {
    color: color.Review,
    fontSize: 14,
    lineHeight: 16,
  } as TextStyle,
  icon: {
    marginLeft: 5,
  },
});
