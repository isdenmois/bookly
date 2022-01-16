import React, { FC } from 'react';

import { BookThumbnail } from 'entities/book';

import { Box, Text } from 'components/theme';
import { TouchableOpacity } from 'react-native';
import { ReadableAtom } from 'nanostores';
import { useStore } from '@nanostores/react';

import Book from 'store/book';
import { RecyclerList } from 'components/recycler-list';
import type { LimitedList } from 'shared/lib';

interface Props {
  list: ReadableAtom<LimitedList<Book>>;
  title?: string;
  onViewAllPress?();
  counterTestId?: string;
}

export const Bookshelf: FC<Props> = ({ title, counterTestId, list, onViewAllPress }) => {
  const { items, totalCount } = useStore(list);

  return (
    <>
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
          data={items}
          itemHeight={144}
          itemWidth={96}
          rowRenderer={renderBook}
          isHorizontal
          showsHorizontalScrollIndicator={false}
        />
      </Box>
    </>
  );
};

const renderBook = (type, book: Book) => <BookThumbnail book={book} title='title' />;
