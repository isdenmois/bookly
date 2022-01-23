import React, { FC } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useStore } from '@nanostores/react';

import { $allLists } from 'entities/list';

import { Checkbox, ListItem } from 'components';

import { $selectedLists, onListSelect } from '../model';

export const SelectedLists: FC = () => {
  const selected = useStore($selectedLists);
  const lists = useStore($allLists);

  return (
    <View style={s.container}>
      {lists.map(list => {
        const toggle = () => onListSelect(list.id);
        return (
          <ListItem key={list.id} style={s.item} rowStyle={s.row} label={list.name} onPress={toggle}>
            <Checkbox value={selected.has(list.id)} onValueChange={toggle} />
          </ListItem>
        );
      })}
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    marginTop: 24,
  } as ViewStyle,
  item: {
    width: 'auto',
  } as ViewStyle,
  row: {
    justifyContent: 'space-between',
  } as ViewStyle,
});
