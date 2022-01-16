import React from 'react';
import { useStore } from '@nanostores/react';

import { Tile } from 'shared/ui';
import { $readBooksThisYear, BookThumbnail } from 'entities/book';

import { RecyclerList } from 'components/recycler-list';
import { Box } from 'components/theme';
import { t } from 'services';
import Book from 'store/book';

export function ReadBooksTile() {
  const books = useStore($readBooksThisYear);

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

const renderBook = (type, book: Book) => <BookThumbnail book={book} title='date' />;
