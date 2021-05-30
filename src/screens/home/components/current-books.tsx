import React, { FC, useState } from 'react';
import { Carousel } from 'components';
import { currentBooksQuery } from '../home.queries';
import { NowReadingBook } from './now-reading-book';
import { EmptyBook } from './empty-book';
import { Dimensions } from 'react-native';
import { useObservable } from 'utils/use-observable';
import { Box, Text, TouchableBox } from 'components/theme';
import { openModal } from 'services';
import { ModalRoutes } from 'navigation/routes';

const PADDINGS = 32;

function getCurrentBooks() {
  return currentBooksQuery().observeWithColumns(['thumbnail']);
}

export const CurrentBook: FC = () => {
  const books = useObservable(getCurrentBooks, null, []);
  const width = Dimensions.get('screen').width;
  const [index, setIndex] = useState(0);
  const openBookSelect = () => openModal(ModalRoutes.BookSelect);

  if (!books) return null;
  if (!books.length) return <EmptyBook />;

  return (
    <Box padding={2}>
      <Box mt={1} flexDirection='row' justifyContent='space-between' alignItems='center'>
        <Text
          variant='medium'
          color='carouselTitle'
          fontSize={18}
          lineHeight={24}
          numberOfLines={1}
          testID='currentBookTitle'
        >
          {books[index]?.title}
        </Text>

        <TouchableBox
          height={24}
          width={24}
          ml={1}
          borderRadius={8}
          backgroundColor='grey10'
          justifyContent='center'
          alignItems='center'
          opacity={books[index] ? 1 : 0}
          onPress={openBookSelect}
        >
          <Text color='notBlack' fontSize={20} lineHeight={24}>
            +
          </Text>
        </TouchableBox>
      </Box>

      <Carousel width={width - PADDINGS} onIndexChange={setIndex}>
        {books.map(book => <NowReadingBook key={book.id} book={book} />).concat(<EmptyBook key='empty' />)}
      </Carousel>
    </Box>
  );
};
