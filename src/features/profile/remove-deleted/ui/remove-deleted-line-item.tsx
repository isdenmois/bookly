import React, { FC } from 'react';
import { ListItem } from 'components';
import { useStore } from '@nanostores/react';
import { $isRemoving, removeDeleted } from '../model';

export const RemoveDeletedLineItem: FC = () => {
  const isRemoving = useStore($isRemoving);

  return <ListItem label='Почистить удаленные записи на сервере' onPress={removeDeleted} disabled={isRemoving} />;
};
