import React from 'react';
import { TouchableOpacity } from 'react-native';

import { Thumbnail } from 'components';
import { RecyclerList } from 'components/recycler-list';
import { Box, Text } from 'components/theme';
import { MainRoutes } from 'navigation/routes';
import { getNavigation } from 'services';
import Book from 'store/book';
import { formatDate } from 'utils/date';
import { useObservable } from 'utils/use-observable';
import { readBooksThisYearQuery } from '../home.queries';

const getBooks = () => readBooksThisYearQuery().observe();

export function ReadBooks() {
  const books = useObservable(getBooks, [], []);

  return (
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
  );
}

function renderBook(type, book: Book) {
  return (
    <TouchableOpacity onPress={() => getNavigation().push(MainRoutes.Details, { bookId: book.id })}>
      <Thumbnail cache style={{ borderRadius: 10 }} width={80} height={120} title={book.title} url={book.thumbnail} />

      <Box mr={2} mt={1} alignItems='center'>
        <Text variant='small'>{formatDate(book.date)}</Text>
      </Box>
    </TouchableOpacity>
  );
}
