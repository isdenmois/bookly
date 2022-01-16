import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useStore } from '@nanostores/react';

import { $wishBooksCount } from 'entities/book';

import { getNavigation, openModal, t } from 'services';
import { Button } from 'components';
import { MainRoutes, ModalRoutes } from 'navigation/routes';
import { Box, Text, useTheme } from 'components/theme';

export const EmptyBook = () => {
  const { colors } = useTheme();
  const wishBooksCount = useStore($wishBooksCount);

  const openBookSelect = () => openModal(ModalRoutes.BookSelect);
  const openBookPicker = () => getNavigation().push(MainRoutes.BookSelect);

  return (
    <Box height={310} alignItems='center' justifyContent='center'>
      <Icon name='bookmark' size={36} color={colors.empty} />

      {!wishBooksCount && (
        <Text variant='empty' mt={3} textAlign='center'>
          {t('home.empty.no-books')}
        </Text>
      )}
      {!!wishBooksCount && (
        <Text variant='empty' mt={3} textAlign='center'>
          {t('home.empty.choose')}
        </Text>
      )}

      {!!wishBooksCount && (
        <Box mt={2}>
          <Button testID='bookPickButton' onPress={openBookPicker} label={t('nav.pick')} thin />
        </Box>
      )}

      {!!wishBooksCount && (
        <Box mt={2}>
          <Button testID='bookSelectButton' onPress={openBookSelect} label={t('modal.select-book')} thin />
        </Box>
      )}
    </Box>
  );
};
