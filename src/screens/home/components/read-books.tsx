import React from 'react';
import { TouchableOpacity } from 'react-native';

import { Thumbnail } from 'components';
import { RecyclerList } from 'components/recycler-list';
import { Box, Text } from 'components/theme';
import { MainRoutes } from 'navigation/routes';
import { getNavigation, t } from 'services';
import Book from 'store/book';
import { formatDate } from 'utils/date';
import { Tile } from './tile';

type Props = {
  books: Book[];
};

export function ReadBooks({ books }: Props) {
  return (
    <Box flexDirection='row'>
      <Tile title={t('home.read-this-year')}>
        <Box mt={2} height={144}>
          <RecyclerList
            data={books}
            itemHeight={144}
            itemWidth={96}
            rowRenderer={renderBook}
            isHorizontal
            showsHorizontalScrollIndicator={false}
          />
        </Box>
      </Tile>
    </Box>
  );
}

function renderBook(type, book: Book) {
  return (
    <TouchableOpacity
      onPress={() => getNavigation().push(MainRoutes.Details, { bookId: book.id })}
      testID={'readBook' + book.id}
    >
      <Thumbnail cache style={{ borderRadius: 10 }} width={80} height={120} title={book.title} url={book.thumbnail} />

      <Box mr={2} mt={1} alignItems='center'>
        <Text variant='small'>{formatDate(book.date)}</Text>
      </Box>
    </TouchableOpacity>
  );
}
