import React, { FC } from 'react';

import { Box, Text } from 'components/theme';
import { ImageStyle, StyleSheet, TouchableOpacity } from 'react-native';
import { Thumbnail } from 'components';
import { getNavigation } from 'services';
import { MainRoutes } from 'navigation/routes';
import Book from 'store/book';
import { formatDate } from 'utils/date';

interface Props {
  book: Book;
  title: 'date' | 'title';
}

export const BookThumbnail: FC<Props> = ({ book, title }) => {
  const text = title === 'title' ? book.title : formatDate(book.date);

  return (
    <TouchableOpacity
      onPress={() => getNavigation().push(MainRoutes.Details, { bookId: book.id })}
      testID={'readBook' + book.id}
    >
      <Thumbnail cache style={s.thumbnail} width={80} height={120} title={book.title} url={book.thumbnail} />

      <Box mr={2} mt={1} alignItems='center'>
        <Text variant='small'>{text}</Text>
      </Box>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  thumbnail: {
    borderRadius: 10,
  } as ImageStyle,
});
