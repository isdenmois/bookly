import React from 'react';
import { StyleSheet, Text, View, TextStyle, ViewStyle } from 'react-native';
import { TouchIcon } from 'components/touch-icon';

interface Props {
  title: string;
  onBack: () => void;
}

export function BookListHeader({ title, onBack }: Props) {
  return (
    <View style={s.container}>
      <TouchIcon style={s.icon} name='arrow-left' size={24} color='#000' onPress={onBack} />
      <Text style={s.title}>{title}</Text>
      <View style={s.iconPlaceholder} />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  } as ViewStyle,
  icon: {
    zIndex: 2,
  } as ViewStyle,
  title: {
    color: 'black',
    fontSize: 24,
    textAlign: 'center',
    flex: 1,
    marginLeft: 20,
  } as TextStyle,
  iconPlaceholder: {
    width: 45,
  },
});
