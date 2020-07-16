import React, { useCallback } from 'react';
import { StyleSheet, Text, View, ViewStyle, ImageStyle, TouchableOpacity } from 'react-native';
import Book from 'store/book';
import { color, dark } from 'types/colors';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { navigation } from 'services';
import { ReadButton, TextXL, Thumbnail } from 'components';
import { DynamicStyleSheet, DynamicValue, useDynamicValue } from 'react-native-dynamic';

interface Props {
  book: Book;
}

export function NowReadingBook({ book }: Props) {
  const ds = useDynamicValue(dynamicStyles);
  const openChangeStatus = useCallback(
    () => navigation.navigate('/modal/change-status', { book, status: BOOK_STATUSES.READ }),
    [],
  );
  const openBook = useCallback(() => navigation.push('Details', { bookId: book.id }), []);

  return (
    <View style={s.container}>
      <TouchableOpacity style={s.thumbnail} onPress={openBook} testID='CurrentThumbnail'>
        <Thumbnail
          auto='height'
          cache
          style={s.image}
          width={120}
          height={192}
          title={book.title}
          url={book.thumbnail}
        />
      </TouchableOpacity>

      <View style={s.details}>
        <TouchableOpacity onPress={openBook}>
          <TextXL testID='homeBookTitle' style={ds.title}>
            {book.title}
          </TextXL>
        </TouchableOpacity>
        <Text testID='homeBookAuthor' style={ds.author}>
          {book.author}
        </Text>
        <ReadButton testID='homeReadButton' openChangeStatus={openChangeStatus} book={book} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 20,
    maxWidth: '100%',
  } as ViewStyle,
  thumbnail: {
    marginRight: 15,
    borderRadius: 5,
  } as ImageStyle,
  image: {
    borderRadius: 5,
  } as ImageStyle,
  details: {
    alignItems: 'flex-start',
    flex: 1,
  } as ViewStyle,
});

const dynamicStyles = new DynamicStyleSheet({
  title: {
    color: new DynamicValue(color.PrimaryText, dark.PrimaryText),
  },
  author: {
    fontSize: 14,
    color: new DynamicValue(color.SecondaryText, dark.SecondaryText),
    marginTop: 5,
  },
});
