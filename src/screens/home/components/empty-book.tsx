import React from 'react';
import { useObservable } from 'utils/use-observable';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { openModal, t } from 'services';
import { Button } from 'components';
import { ModalRoutes } from 'navigation/routes';
import { Box, Text, useTheme } from 'components/theme';
import { wishBooksQuery } from '../home.queries';

const getWishBooksCount = () => wishBooksQuery().observeCount();

export const EmptyBook = () => {
  const wishBooksCount = useObservable(getWishBooksCount, 1, []);
  const openBookSelect = () => openModal(ModalRoutes.BookSelect);
  const { colors } = useTheme();

  return (
    <Box height={400} alignItems='center' justifyContent='center'>
      <Icon name='bookmark' size={36} color={colors.Empty} />

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
        <Box mt={3}>
          <Button testID='bookSelectButton' onPress={openBookSelect} label={t('modal.select-book')} />
        </Box>
      )}
    </Box>
  );
};
