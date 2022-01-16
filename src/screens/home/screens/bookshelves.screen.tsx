import React, { FC } from 'react';
import { ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { useStore } from '@nanostores/react';

import { $allLists } from 'entities/list';
import { $listBooks, $readBooksLimited, $wishBooksLimited } from 'entities/book';
import { Bookshelf } from 'features/bookshelf';

import { getNavigation } from 'services';
import { MainRoutes } from 'navigation/routes';
import List from 'store/list';
import { Box } from 'components/theme';

const openReadList = () => getNavigation().push(MainRoutes.ReadList);
const openWishList = () => getNavigation().push(MainRoutes.WishList);
const openList = (list: List) => () =>
  getNavigation().push(MainRoutes.WishList, { listId: list.id, listName: list.name });

export const BookshelvesScreen: FC = () => {
  const lists = useStore($allLists);

  return (
    <ScrollView contentContainerStyle={s.scroll} testID='shelvesScreen'>
      <Bookshelf title='Read books' list={$readBooksLimited} onViewAllPress={openReadList} counterTestId='readCount' />

      <Box mt={6}>
        <Bookshelf
          title='Want to read'
          list={$wishBooksLimited}
          onViewAllPress={openWishList}
          counterTestId='wishCount'
        />
      </Box>

      {lists.map(list => (
        <Box key={list.id} mt={6}>
          <Bookshelf title={list.name} list={$listBooks(list.id)} onViewAllPress={openList(list)} />
        </Box>
      ))}
    </ScrollView>
  );
};

const s = StyleSheet.create({
  scroll: {
    padding: 16,
  } as ViewStyle,
});
