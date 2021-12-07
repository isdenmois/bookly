import React, { FC, useMemo } from 'react';

import { CoordinatorHeader, CoordinatorLayout, CoordinatorTabs } from 'components/coordinator';
import Book from 'store/book';
import { BookExtended } from 'types/book-extended';

import { BookMainInfo } from './components/book-main-info';

interface Props {
  initialTab: number;
  tabs: any[];
  book: Book & BookExtended;
  isExist: boolean;
  fantlabId?: string;
  navigation: any;
}

export const BookDetails: FC<Props> = ({ tabs, book, initialTab, isExist, fantlabId, navigation }) => {
  const extraProps = useMemo(() => ({ book, isExist, fantlabId, navigation }), [book, fantlabId, isExist]);

  return (
    <CoordinatorLayout>
      <CoordinatorHeader>
        <BookMainInfo book={book} />
      </CoordinatorHeader>

      <CoordinatorTabs tabs={tabs} initialTab={initialTab} extraProps={extraProps} />
    </CoordinatorLayout>
  );
};
