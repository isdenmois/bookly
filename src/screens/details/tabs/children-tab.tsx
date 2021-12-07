import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BookExtended } from 'types/book-extended';
import { CollapsibleChildren } from '../components/collapsible-children';
import { MainRoutes, MainScreenProps } from 'navigation/routes';

type Props = MainScreenProps<MainRoutes.Details> & {
  book: BookExtended;
  mode: string;
};

export const ChildrenTab = (props: Props) => {
  return (
    <View style={s.container}>
      {props.book.children.map(book => (
        <CollapsibleChildren key={book.id || book.title} book={book} navigation={props.navigation} mode={props.mode} />
      ))}
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    padding: 16,
  },
});
