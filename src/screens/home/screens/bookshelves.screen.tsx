import React, { FC } from 'react';
import { Q, Query } from '@nozbe/watermelondb';

import { Box, Text } from 'components/theme';
import { RecyclerList } from 'components/recycler-list';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Thumbnail } from 'components';
import { getNavigation } from 'services';
import { MainRoutes } from 'navigation/routes';
import Book from 'store/book';
import { useObservable } from 'utils/use-observable';
import { allListsObserver, listBooksQuery, readBooksQuery, wishBooksQuery } from '../home.queries';
import List from 'store/list';

const LIMIT = 10;

const openReadList = () => getNavigation().push(MainRoutes.ReadList);
const openWishList = () => getNavigation().push(MainRoutes.WishList);
const openList = (list: List) => () =>
  getNavigation().push(MainRoutes.WishList, { listId: list.id, listName: list.name });

export const BookshelvesScreen: FC = () => {
  const lists = useObservable(allListsObserver, [], []);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }} testID='shelvesScreen'>
      <BookList title='Read books' query={readBooksQuery} onViewAllPress={openReadList} counterTestId='readCount' />
      <BookList
        mt={6}
        title='Want to read'
        query={wishBooksQuery}
        onViewAllPress={openWishList}
        counterTestId='wishCount'
      />

      {lists.map(list => (
        <BookList
          key={list.id}
          mt={6}
          title={list.name}
          query={() => listBooksQuery(list.id)}
          onViewAllPress={openList(list)}
        />
      ))}
    </ScrollView>
  );
};

type ListProps = { mt?: number; query(): Query<Book>; title?: string; onViewAllPress?(); counterTestId?: string };
function BookList({ mt, title, counterTestId, query, onViewAllPress }: ListProps) {
  const books = useObservable(() => query().extend(Q.experimentalTake(LIMIT)).observe(), [], []);
  const totalCount = useObservable(() => query().observeCount(), 0, []);

  return (
    <Box mt={mt}>
      {!!title && (
        <Box flexDirection='row' justifyContent='space-between'>
          <Text variant='body'>{title}</Text>

          <TouchableOpacity onPress={onViewAllPress}>
            <Text variant='body' testID={counterTestId}>
              {'View all'}
              {totalCount > 0 ? ` (${totalCount})` : ''}
            </Text>
          </TouchableOpacity>
        </Box>
      )}

      <Box mt={1} height={144}>
        <RecyclerList
          data={books}
          itemHeight={144}
          itemWidth={96}
          rowRenderer={renderBook}
          isHorizontal
          showsHorizontalScrollIndicator={false}
        />
      </Box>
    </Box>
  );
}

function renderBook(type, book: Book) {
  return (
    <TouchableOpacity onPress={() => getNavigation().push(MainRoutes.Details, { bookId: book.id })}>
      <Thumbnail cache style={{ borderRadius: 10 }} width={80} height={120} title={book.title} url={book.thumbnail} />

      <Box mr={2} mt={1} alignItems='center'>
        <Text variant='small' numberOfLines={1}>
          {book.title}
        </Text>
      </Box>
    </TouchableOpacity>
  );
}
