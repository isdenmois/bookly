import React, { useCallback } from 'react';
import { StyleSheet, ImageStyle, TouchableOpacity } from 'react-native';
import Book from 'store/book';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { Button, Thumbnail } from 'components';
import { MainRoutes, ModalRoutes } from 'navigation/routes';
import { getNavigation, openModal, t } from 'services';
import { Box, Text } from 'components/theme';

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
    <Box alignItems='center' py={1}>
      <TouchableOpacity style={s.thumbnail} onPress={openBook} testID='currentThumbnail'>
        <Thumbnail cache style={s.image} width={200} height={300} title={book.title} url={book.thumbnail} />
      </TouchableOpacity>

      <TouchableOpacity onPress={openBook}>
        <Text variant='title' pt={1} textAlign='center' testID='currentBookTitle'>
          {book.title}
        </Text>
      </TouchableOpacity>

      <Box mt={1}>
        <Button label={t('button.ive-finished')} thin onPress={openChangeStatus} />
      </Box>
    </Box>
  );
}

const s = StyleSheet.create({
  thumbnail: {
    borderRadius: 20,
  } as ImageStyle,
  image: {
    borderRadius: 20,
  } as ImageStyle,
});
