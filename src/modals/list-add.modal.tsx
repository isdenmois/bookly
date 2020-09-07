import React, { useState } from 'react';
import { TextInput, TextStyle, ViewStyle } from 'react-native';
import { Dialog, Button } from 'components';
import { NavigationStackProp } from 'react-navigation-stack';
import { dynamicColor } from 'types/colors';
import { t, database } from 'services';
import { DynamicStyleSheet, useDarkModeContext } from 'react-native-dynamic';
import { createList } from 'store/list';

interface Props {
  navigation: NavigationStackProp;
}

export const ListAddModal = ({ navigation }: Props) => {
  const [name, setName] = useState('');
  const create = () => {
    createList(database, name);
    navigation.goBack();
  };
  const onPress = name ? create : null;
  const s = ds[useDarkModeContext()];

  return (
    <Dialog style={s.dialog} title='modal.list-add' onApply={onPress}>
      <TextInput
        style={s.input}
        value={name}
        returnKeyType='done'
        placeholder={t('modal.enter-list-name')}
        onChangeText={setName}
        onSubmitEditing={onPress}
      />

      <Button style={s.button} label={t('button.add')} disabled={!name} onPress={onPress} />
    </Dialog>
  );
};

const ds = new DynamicStyleSheet({
  dialog: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  } as ViewStyle,
  input: {
    fontSize: 14,
    color: dynamicColor.PrimaryText,
    paddingHorizontal: 0,
    paddingVertical: 10,
    margin: 0,
  } as TextStyle,
  button: {
    marginTop: 20,
  } as ViewStyle,
});
