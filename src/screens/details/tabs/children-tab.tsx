import React from 'react';
import { View } from 'react-native';
import { BookExtended } from 'types/book-extended';
import { withScroll } from './tab';
import { CollapsibleChildren } from '../components/collapsible-children';
import { MainRoutes, MainScreenProps } from 'navigation/routes';

type Props = MainScreenProps<MainRoutes.Details> & {
  book: BookExtended;
  mode: string;
};

export const ChildrenTab = withScroll((props: Props) => {
  return (
    <View>
      {props.book.children.map(book => (
        <CollapsibleChildren key={book.id || book.title} book={book} navigation={props.navigation} mode={props.mode} />
      ))}
    </View>
  );
});
