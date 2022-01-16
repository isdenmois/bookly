import React from 'react';
import { StyleSheet, ImageStyle, TouchableOpacity, Platform, View } from 'react-native';
import Book from 'store/book';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { Button2, Thumbnail } from 'components';
import { MainRoutes, ModalRoutes } from 'navigation/routes';
import { getNavigation, openModal, t } from 'services';
import { Box } from 'components/theme';
import { BookEdge } from 'entities/book';

interface Props {
  book: Book;
}

export function NowReadingBook({ book }: Props) {
  const openChangeStatus = () => openModal(ModalRoutes.ChangeStatus, { book, status: BOOK_STATUSES.READ });
  const openBook = () => getNavigation().push(MainRoutes.Details, { bookId: book.id });

  return (
    <Box alignItems='center' mt={3}>
      <TouchableOpacity style={s.thumbnail} onPress={openBook} testID='currentThumbnail'>
        <View style={s.imageBackground} />
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
  imageBackground: {
    position: 'absolute',
    width: 130,
    height: 225,
    left: 0,
    top: 0,
    backgroundColor: '#F3F4F1',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    zIndex: 2,
  },
  thumbnail: {
    flexDirection: 'row',
    width: 166,
    backgroundColor: '#F3F4F1',
    borderRadius: 20,
  } as ImageStyle,
  image: {
    borderRadius: 20,
    zIndex: 3,
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
