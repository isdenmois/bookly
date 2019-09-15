import React, { useState, useCallback, useMemo, useEffect } from 'react';
import _ from 'lodash';
import { Text, View, ViewStyle, StyleSheet, ImageStyle, TextStyle, Linking } from 'react-native';
import Book from 'store/book';
import { Database } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import { Where } from '@nozbe/watermelondb/QueryDescription';
import { Button, Thumbnail } from 'components';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { color } from 'types/colors';

interface Props {
  query: Where[];
  database: Database;
  books?: Book[];
}

function BookSelectorComponent({ books }: Props) {
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [books]);
  const list = useMemo(() => generate(books), [books]);
  const more = useCallback(() => setIndex(index < list.length - 1 ? index + 1 : 0), [index, list]);
  const openTelegram = useCallback(() => Linking.openURL(`tg://share?text=${list[index].title}`), [list, index]);

  if (!list || !list[index]) {
    return <Text>Ничего не найдено</Text>;
  }

  const book = list[index];

  return (
    <View style={s.container}>
      <View style={s.book}>
        <TouchableOpacity>
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
        <Button label='Найти в Telegram' onPress={openTelegram} />
        <Button style={s.more} label='Еще' onPress={more} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
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
    color: color.PrimaryText,
    fontFamily: 'sans-serif-medium',
    marginTop: 20,
  } as TextStyle,
  author: {
    fontSize: 20,
    color: color.PrimaryText,
    fontFamily: 'sans-serif-light',
    marginTop: 10,
  } as TextStyle,
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  } as ViewStyle,
  more: {
    width: 167,
  } as ViewStyle,
});

export const BookSelector = withObservables(['query'], booksQuery)(React.memo(BookSelectorComponent));

function booksQuery({ database, query }: Props) {
  return {
    books: database.collections.get('books').query(...query),
  };
}

function generate(books: Book[]) {
  return _.shuffle(books);
}
