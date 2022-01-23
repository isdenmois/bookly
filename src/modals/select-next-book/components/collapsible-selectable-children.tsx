import React, { memo } from 'react';
import { useStore } from '@nanostores/react';

import { CollapsibleBookChild } from 'entities/book';

import { ChildBook } from 'types/book-extended';
import { Checkbox } from 'components';

import { $selected, onSelect } from '../model';

interface Props {
  book: ChildBook;
}

export const CollapsibleSelectableChildren = memo<Props>(({ book }) => {
  const bookId = book.id || book.title;
  const selected = useStore($selected, { keys: [bookId] });
  const toggle = () => onSelect(bookId);
  const isSelected = selected[bookId];

  return (
    <CollapsibleBookChild book={book} icon={<Checkbox value={isSelected} onValueChange={toggle} />} onPress={toggle}>
      {book.children?.map(c => (
        <CollapsibleSelectableChildren key={c.id || c.title} book={c} />
      ))}
    </CollapsibleBookChild>
  );
});
