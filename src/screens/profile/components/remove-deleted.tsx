import React, { useState, useCallback } from 'react';
import { ListItem } from 'components';
import { inject } from 'services';
import { API } from 'services/api';
import { ToastAndroid } from 'react-native';

export function RemoveDeleted() {
  const [removing, setRemoving] = useState(false);
  const toRemove = useCallback(() => removeDeleted(setRemoving), []);

  return <ListItem label='Почистить удаленные записи на сервере' onPress={toRemove} disabled={removing} />;
}

async function removeDeleted(setRemoving: Function) {
  setRemoving(true);

  const { deleted } = await inject(API).removeDeleted();

  const message = deleted > 0 ? `Были удалено ${deleted} записей` : 'Удаленных записей не обнаружено';

  ToastAndroid.show(message, ToastAndroid.SHORT);

  setRemoving(false);
}
