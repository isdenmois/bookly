import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { color } from 'types/colors';

interface Props {
  title: string;
  onRemove?: () => void;
}

export function Tag({ title, onRemove }: Props) {
  const Wrapper: any = onRemove ? TouchableOpacity : View;

  return (
    <Wrapper style={s.wrapper} onPress={onRemove}>
      <Text style={s.text}>{title}</Text>
      {!!onRemove && <Icon style={s.icon} name='times' size={14} color={color.PrimaryTextInverse} />}
    </Wrapper>
  );
}

const s = StyleSheet.create({
  wrapper: {
    backgroundColor: color.SecondaryText,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  text: {
    color: color.PrimaryTextInverse,
    fontSize: 14,
    lineHeight: 16,
  } as TextStyle,
  icon: {
    marginLeft: 5,
  },
});
