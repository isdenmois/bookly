import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { Alert, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { ListItem } from '../list-item';

storiesOf('ListItem')
  .add('Usage', () => (
    <View style={s.centered}>
      <ListItem
        onPress={() => Alert.alert('test')}
        icon={<Icon name='flag' size={20} color='#0D47A1' />}
        value='Прочитанные'
        counter={303}
      />
      <ListItem icon={<Icon name='plus' size={20} color='#0D47A1' />} value='Хочу прочитать' counter={21} />
      <ListItem icon={<Icon name='sync' size={20} color='#0D47A1' />} value='Синхронизация' />
      <ListItem icon={<Icon name='user' size={20} color='#0D47A1' />} value='Профиль' counter='imray' last />
    </View>
  ))
  .add('Selected', () => (
    <View style={s.centered}>
      <ListItem value='Прочитанные' />
      <ListItem value='Хочу прочитать' selected={<Icon name='check' size={18} color='#009688' />} />
      <ListItem value='Синхронизация' />
      <ListItem value='Профиль' last />
    </View>
  ));

const s = StyleSheet.create({
  centered: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
});
