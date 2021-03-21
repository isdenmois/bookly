import React, { FC } from 'react';
import { Carousel } from 'components';
import { currentBooksQuery } from '../home.queries';
import { NowReadingBook } from './now-reading-book';
import { EmptyBook } from './empty-book';
import { Dimensions } from 'react-native';
import { useObservable } from 'utils/use-observable';

const PADDINGS = 48;

function getCurrentBooks() {
  return currentBooksQuery().observeWithColumns(['thumbnail']);
}

export const CurrentBook: FC = () => {
  const books = useObservable(getCurrentBooks, null, []);
  const width = Dimensions.get('screen').width;

  if (!books) return null;
  if (!books.length) return <EmptyBook />;

  return (
    <Carousel width={width - PADDINGS}>
      {books.map(book => <NowReadingBook key={book.id} book={book} />).concat(<EmptyBook key='empty' />)}
    </Carousel>
  );
};
