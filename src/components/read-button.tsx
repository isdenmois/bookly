import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { StyleSheet, Text, View, ViewStyle, TextStyle, ImageStyle, TouchableOpacity } from 'react-native';
import { Button } from 'components/button';

interface Props {
  openChangeStatus: () => void;
  style?: ViewStyle;
}

export function ReadButton(props: Props) {
  return (
    <Button
      label='Сейчас читаю'
      icon={<Icon name='clock' size={18} color='#F57C00' />}
      style={[props.style, s.orange]}
      textStyle={s.textOrange}
      onPress={props.openChangeStatus}
      thin
    />
  );
}
const s = StyleSheet.create({
  orange: {
    backgroundColor: '#FFE0B2',
    marginTop: 10,
  } as ViewStyle,
  textOrange: {
    fontSize: 18,
    color: '#F57C00',
  } as TextStyle,
});
