import React, { FC, useMemo } from 'react';
import { Route } from 'react-native-tab-view';

import { CoordinatorHeader, CoordinatorLayout, CoordinatorTabs } from 'components/coordinator';
import Book from 'store/book';
import { BookExtended } from 'types/book-extended';

import { BookMainInfo } from './components/book-main-info';

interface Props {
  initialTab: number;
  tabs: Route[];
  book: Book & BookExtended;
  isExist: boolean;
  fantlabId?: string;
}

export const BookDetails: FC<Props> = ({ tabs, book, initialTab, isExist, fantlabId }) => {
  const extraProps = useMemo(() => ({ book, isExist, fantlabId }), [book, fantlabId, isExist]);

  return (
    <CoordinatorLayout>
      <CoordinatorHeader>
        <BookMainInfo book={book} />
      </CoordinatorHeader>

      <CoordinatorTabs tabs={tabs} initialTab={initialTab} extraProps={extraProps} />
    </CoordinatorLayout>
  );
};
