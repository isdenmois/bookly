import React, { FC } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Thumbnail } from 'components';
import Book from 'store/book';
import { BookExtended } from 'types/book-extended';
import { ThumbnailList } from 'modals/book-editor/components/thumbnail-list';

interface Props {
  book: Book & BookExtended;
  thumbnail: string;
  onThumbnailChange: (thumbnail: string) => void;
}

export const ThumbnailEdit: FC<Props> = ({ book, thumbnail, onThumbnailChange }) => {
  const isLiveLib = book.id.startsWith('l_');

  return (
    <View>
      <View style={s.thumbnail}>
        <Thumbnail auto='height' width={150} height={200} url={thumbnail} title={book.title} />
      </View>

      {!isLiveLib && <ThumbnailList book={book} selected={thumbnail} onSelect={onThumbnailChange} />}
    </View>
  );
};

const s = StyleSheet.create({
  thumbnail: {
    justifyContent: 'center',
    flexDirection: 'row',
  } as ViewStyle,
});
