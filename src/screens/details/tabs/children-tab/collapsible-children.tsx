import React, { memo, useCallback } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { CollapsibleBookChild } from 'entities/book';

import { MainRoutes } from 'navigation/routes';
import { getNavigation } from 'services';
import { useTheme } from 'components/theme';
import { ChildBook } from 'types/book-extended';

interface Props {
  book: ChildBook;
}

export const CollapsibleChildren = memo<Props>(({ book }) => {
  const openBook = useCallback(() => getNavigation().push(MainRoutes.Details, { bookId: String(book.id) }), []);
  const { colors } = useTheme();

  return (
    <CollapsibleBookChild
      book={book}
      icon={<Icon name='chevron-right' size={18} color={colors.SecondaryText} />}
      onPress={openBook}
    >
      {book.children?.map(c => (
        <CollapsibleChildren key={c.id || c.title} book={c} />
      ))}
    </CollapsibleBookChild>
  );
});
