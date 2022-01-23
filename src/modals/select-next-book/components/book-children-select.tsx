import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import { useSuspendApi } from 'shared/lib/fetcher';

import { api } from 'services';

import { CollapsibleSelectableChildren } from './collapsible-selectable-children';

interface Props {
  bookId: string;
}

export const BookChildrenSelect: FC<Props> = ({ bookId }) => {
  const book = useSuspendApi(api.book, { bookId }, [bookId]);

  return <View style={s.container}>{!!book && <CollapsibleSelectableChildren book={book} />}</View>;
};

const s = StyleSheet.create({
  container: {
    padding: 16,
  },
});
