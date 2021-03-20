import React, { useState, useCallback, useMemo, useEffect } from 'react';
import _ from 'lodash';
import { TouchableOpacity, Text, View, ViewStyle, ImageStyle, TextStyle, Linking, Platform } from 'react-native';
import withObservables from '@nozbe/with-observables';
import { Where } from '@nozbe/watermelondb/QueryDescription';
import { DynamicStyleSheet, useDynamicValue } from 'react-native-dynamic';

import { MainRoutes } from 'navigation/routes';
import Book from 'store/book';
import { Button, Thumbnail } from 'components';
import { dynamicColor, boldText, lightText } from 'types/colors';
import { BOOK_UPLOADER_URL } from 'services/config';
import { getNavigation, t } from 'services';
import { database } from 'store';

interface Props {
  query: Where[];
  openFilters: () => void;
  books?: Book[];
}

export function openInTelegram(text) {
  if (Platform.OS === 'web') {
    Linking.openURL(`${BOOK_UPLOADER_URL}?q=${text}`);
  } else {
    Linking.openURL(`booksearch://${text}`);
  }
}

function BookSelectorComponent({ books, openFilters }: Props) {
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [books]);
  const list = useMemo(() => generate(books), [books]);
  const more = useCallback(() => setIndex(index < list.length - 1 ? index + 1 : 0), [index, list]);
  const openTelegram = useCallback(() => openInTelegram(list[index].title), [list, index]);
  const openBook = useCallback(() => getNavigation().push(MainRoutes.Details, { bookId: list[index].id }), [
    list,
    index,
  ]);
  const s = useDynamicValue(ds);

  if (!list || !list[index]) {
    return (
      <View style={s.container}>
        <View style={s.book}>
          <Text style={s.empty}>Ничего не найдено</Text>
        </View>

        <Button label='Изменить фильтры' onPress={openFilters} />
      </View>
    );
  }

  const book = list[index];

  return (
    <View style={s.container}>
      <View style={s.book}>
        <TouchableOpacity onPress={openBook}>
          <Thumbnail
            style={s.thumbnail}
            width={230}
            height={370}
            auto='width'
            title={book.title}
            url={book.thumbnail}
            cache
          />
        </TouchableOpacity>
        <Text style={s.title} numberOfLines={1}>
          {book.title}
        </Text>
        <Text style={s.author} numberOfLines={1}>
          {book.author}
        </Text>
      </View>

      <View style={s.buttons}>
        <Button label={t('button.book-search')} onPress={openTelegram} />
        <Button style={s.more} label={t('button.more')} onPress={more} />
      </View>
    </View>
  );
}

const ds = new DynamicStyleSheet({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 20,
  } as ViewStyle,
  book: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  thumbnail: {
    borderRadius: 10,
  } as ImageStyle,
  title: {
    fontSize: 20,
    color: dynamicColor.PrimaryText,
    marginTop: 20,
    ...boldText,
  } as TextStyle,
  author: {
    fontSize: 20,
    color: dynamicColor.PrimaryText,
    marginTop: 10,
    ...lightText,
  } as TextStyle,
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  } as ViewStyle,
  more: {
    width: 167,
  } as ViewStyle,
  empty: {
    fontSize: 24,
    color: dynamicColor.Empty,
  } as TextStyle,
});

export const BookSelector = withObservables(['query'], booksQuery)(React.memo(BookSelectorComponent));

function booksQuery({ query }: Props) {
  return {
    books: database.collections.get('books').query(...query),
  };
}

function generate(books: Book[]) {
  return _.shuffle(books);
}
