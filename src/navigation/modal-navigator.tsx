import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ChangeStatusModal } from 'modals/change-status/change-status.modal';
import { BookSelectModal } from 'modals/book-select/book-select.modal';
import { BookFiltersModal } from 'modals/book-filters/book-filters.modal';
import { ThumbnailSelectModal } from 'modals/thumbnail-select/thumbnail-select.modal';
import { ReviewWriteModal } from 'modals/review-write/review-write.modal';
import { FantlabLoginModal } from 'modals/fantlab-login/fantlab-login.modal';
import { BookTitleEditModal } from 'modals/book-title-edit/book-title-edit.modal';
import { ScanIsbnModal } from 'modals/scan-isbn/scan-isbn.modal';
import { ListAddModal } from 'modals/list-add.modal';
import { ListEditModal } from 'modals/list-edit.modal';
import { ListBookSelectModal } from 'modals/list-book-select.modal';
import { BookActionsModal } from 'modals/book-actions';
import { BookEditorModal } from 'modals/book-editor/book-editor.modal';

import { ModalRoutes } from './routes';

const Stack = createStackNavigator();
export function ModalNavigator() {
  return (
    <Stack.Navigator mode='modal' headerMode='none' screenOptions={{ cardStyle: { backgroundColor: 'transparent' } }}>
      <Stack.Screen name={ModalRoutes.ChangeStatus} component={ChangeStatusModal} />
      <Stack.Screen name={ModalRoutes.BookSelect} component={BookSelectModal} />
      <Stack.Screen name={ModalRoutes.BookFilters} component={BookFiltersModal} />
      <Stack.Screen name={ModalRoutes.ThumbnailSelect} component={ThumbnailSelectModal} />
      <Stack.Screen name={ModalRoutes.ReviewWrite} component={ReviewWriteModal} />
      <Stack.Screen name={ModalRoutes.FantlabLogin} component={FantlabLoginModal} />
      <Stack.Screen name={ModalRoutes.BookTitleEdit} component={BookTitleEditModal} />
      <Stack.Screen name={ModalRoutes.ScanIsbn} component={ScanIsbnModal} />
      <Stack.Screen name={ModalRoutes.ListAdd} component={ListAddModal} />
      <Stack.Screen name={ModalRoutes.ListEdit} component={ListEditModal} />
      <Stack.Screen name={ModalRoutes.ListBookSelect} component={ListBookSelectModal} />
      <Stack.Screen name={ModalRoutes.BookActions} component={BookActionsModal} />
      <Stack.Screen name={ModalRoutes.BookEditor} component={BookEditorModal} />
    </Stack.Navigator>
  );
}
