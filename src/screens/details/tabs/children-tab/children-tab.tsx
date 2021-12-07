import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BookExtended } from 'types/book-extended';
import { CollapsibleChildren } from './collapsible-children';

interface Props {
  book: BookExtended;
}

export const ChildrenTab = memo<Props>(({ book }) => {
  return (
    <View style={s.container}>
      {book.children.map(childBook => (
        <CollapsibleChildren key={childBook.id || childBook.title} book={childBook} />
      ))}
    </View>
  );
});

const s = StyleSheet.create({
  container: {
    padding: 16,
  },
});
