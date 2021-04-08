import React from 'react';
import { useObservable } from 'utils/use-observable';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { getNavigation, openModal, t } from 'services';
import { Button } from 'components';
import { MainRoutes, ModalRoutes } from 'navigation/routes';
import { Box, Text, useTheme } from 'components/theme';
import { wishBooksQuery } from '../home.queries';

const getWishBooksCount = () => wishBooksQuery().observeCount();

export const EmptyBook = () => {
  const wishBooksCount = useObservable(getWishBooksCount, 1, []);
  const openBookSelect = () => openModal(ModalRoutes.BookSelect);
  const openBookPicker = () => getNavigation().push(MainRoutes.BookSelect);
  const { colors } = useTheme();

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
