import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Button } from '../button';

storiesOf('Button').add('Usage', () => (
  <View style={s.centered}>
    <View style={s.marginBottom}>
      <Button label='Нажми на меня' />
    </View>

    <View style={s.marginBottom}>
      <Button
        label='ФИЛЬТРЫ'
        icon={<Icon name='sliders-h' size={18} color='black' />}
        style={s.white}
        textStyle={s.blackText}
      />
    </View>

    <View style={s.marginBottom}>
      <Button thin label='Прочитано' />
    </View>

    <View style={s.marginBottom}>
      <Button
        label='Сейчас читаю'
        icon={<Icon name='clock' size={18} color='#F57C00' />}
        style={s.orange}
        textStyle={s.textOrange}
        thin
      />
    </View>
  </View>
));

const s = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  marginBottom: {
    marginBottom: 10,
  },
  orange: {
    backgroundColor: '#FFE0B2',
  },
  textOrange: {
    fontSize: 18,
    color: '#F57C00',
  },
  white: {
    backgroundColor: 'white',
    elevation: 3,
  },
  blackText: {
    color: 'black',
  },
});
