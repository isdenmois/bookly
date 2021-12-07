import React, { FC, useState } from 'react';
import { TextInput, TextStyle, ViewStyle } from 'react-native';
import { Dialog, Button, TouchIcon } from 'components';
import { dynamicColor, useSColor } from 'types/colors';
import { t, database } from 'services';
import { DynamicStyleSheet } from 'react-native-dynamic';
import { confirm } from 'screens/details/tabs/details-tab/book-details-lines';
import { ModalRoutes, ModalScreenProps } from 'navigation/routes';

type Props = ModalScreenProps<ModalRoutes.ListEdit>;

export const ListEditModal: FC<Props> = ({ navigation, route }) => {
  const list = route.params.list;
  const [name, setName] = useState(list.name);
  const update = () => {
    list.setName(name);
    navigation.goBack();
  };
  const remove = () =>
    confirm(list.name, t('modal.list-remove')).then(() => {
      database.action(() => list.markAsDeleted());
      navigation.goBack();
    });
  const enabled = name && name !== list.name;
  const onPress = enabled ? update : null;
  const { s, color } = useSColor(ds);
  const deleteIcon = <TouchIcon name='trash' size={22} color={color.PrimaryText} onPress={remove} paddingLeft={10} />;

  return (
    <Dialog style={s.dialog} title='modal.list-edit' onApply={onPress} rightIcon={deleteIcon}>
      <TextInput
        style={s.input}
        value={name}
        returnKeyType='done'
        placeholder={t('modal.enter-list-name')}
        onChangeText={setName}
        onSubmitEditing={onPress}
      />

      <Button style={s.button} label={t('button.apply')} disabled={!name} onPress={onPress} />
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
