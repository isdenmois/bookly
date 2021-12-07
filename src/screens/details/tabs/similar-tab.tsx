import React, { memo, useCallback } from 'react';
import { Text, View, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dynamic';

import { dynamicColor, lightText } from 'types/colors';
import { api, getNavigation } from 'services';
import { Fetcher, Thumbnail } from 'components';
import { BookSimilar } from 'services/api/fantlab/similar';
import { BookExtended } from 'types/book-extended';
import Book from 'store/book';
import { MainRoutes } from 'navigation/routes';

interface Props {
  book: Book & BookExtended;
}

export const SimilarTab = memo<Props>(({ book }) => {
  const s = useDynamicStyleSheet(ds);

  const openBook = (similar: BookSimilar) => {
    getNavigation().push(MainRoutes.Details, { bookId: String(similar.id) });
  };

  const renderBook = useCallback(
    (similar: BookSimilar, index: number) => {
      const style = index === 0 ? s.firstRow : s.row;

      return (
        <TouchableOpacity key={similar.id} onPress={() => openBook(similar)} style={style}>
          <Thumbnail title={similar.title} url={similar.thumbnail} width={50} height={80} />

          <View style={s.info}>
            <Text style={s.title}>{similar.title}</Text>
            <Text style={s.author}>{similar.author}</Text>
          </View>
        </TouchableOpacity>
      );
    },
    [s],
  );

  return (
    <View style={s.container}>
      <Fetcher bookId={book.id} api={api.similar} emptyText='Похожие книги не найдены'>
        {renderBook}
      </Fetcher>
    </View>
  );
});

const ds = new DynamicStyleSheet({
  container: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
  } as ViewStyle,
  firstRow: {
    flexDirection: 'row',
    paddingBottom: 10,
  } as ViewStyle,
  info: {
    marginLeft: 10,
    flex: 1,
  } as ViewStyle,
  title: {
    color: dynamicColor.PrimaryText,
    fontSize: 18,
  } as TextStyle,
  author: {
    color: dynamicColor.SecondaryText,
    fontSize: 18,
    ...lightText,
  } as TextStyle,
});
