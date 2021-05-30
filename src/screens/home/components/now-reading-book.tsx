import React, { useCallback } from 'react';
import { StyleSheet, ImageStyle, TouchableOpacity, Platform } from 'react-native';
import Book from 'store/book';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { Button2, Thumbnail } from 'components';
import { MainRoutes, ModalRoutes } from 'navigation/routes';
import { getNavigation, openModal, t } from 'services';
import { Box } from 'components/theme';
import { BookEdge } from './book-edge';

interface Props {
  book: Book;
}

export function NowReadingBook({ book }: Props) {
  const openChangeStatus = useCallback(
    () => openModal(ModalRoutes.ChangeStatus, { book, status: BOOK_STATUSES.READ }),
    [],
  );
  const openBook = useCallback(() => getNavigation().push(MainRoutes.Details, { bookId: book.id }), []);

  return (
    <Box alignItems='center' mt={3}>
      <TouchableOpacity style={s.thumbnail} onPress={openBook} testID='currentThumbnail'>
        <Thumbnail cache style={s.image} width={150} height={225} title={book.title} url={book.thumbnail} />

        <BookEdge />
      </TouchableOpacity>

      <Button2
        mt={2}
        label={t('button.ive-finished')}
        variant='inverted'
        onPress={openChangeStatus}
        testID='iFinishedButton'
      />
    </Box>
  );
}

const s = StyleSheet.create({
  thumbnail: {
    flexDirection: 'row',
    width: 166,
  } as ImageStyle,
  image: {
    borderRadius: 20,
    zIndex: 2,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: 'rgb(0 0 0 / 25%) 1px 2px 2px',
      },
    }),
  } as ImageStyle,
});
