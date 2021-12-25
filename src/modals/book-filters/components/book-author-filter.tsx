import React, { memo, useCallback, useState } from 'react';
import _ from 'lodash';
import { TextInput, TextStyle } from 'react-native';
import { DynamicStyleSheet } from 'react-native-dynamic';
import { Q } from '@nozbe/watermelondb';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { dynamicColor, useSColor } from 'types/colors';
import Author from 'store/author';
import { database } from 'store';
import { t } from 'services';
import { useObservable } from 'utils/use-observable';
import { EditableListItem } from './editable-list-item';
import { useFormState } from '../book-filters.form';

interface Props {
  status: BOOK_STATUSES;
}

function getAuthorList([status]) {
  const queries = [
    Q.experimentalNestedJoin('book_authors', 'books'),
    Q.on('book_authors', Q.on('books', 'status', status)),
    Q.sortBy('name'),
  ];
  const authors = database.collections.get<Author>('authors');

  return authors.query(...queries).observe();
}

export const BookAuthorFilter = memo(({ status }: Props) => {
  let authors = useObservable(getAuthorList, [], [status]);
  const [name, setName] = useState('');
  const [author, setFilter] = useFormState('author');

  const setAuthor = useCallback(
    id => {
      const author = _.find(authors, { id }) || null;

      setFilter(author && _.pick(author, ['id', 'name']));
      setName('');
    },
    [author, authors],
  );

  if (name) {
    authors = authors.filter(a => a.name.toLowerCase().indexOf(name) >= 0);
  }

  const { s, color } = useSColor(ds);
  const placeholderTextColor = color.SecondaryText;

  return (
    <EditableListItem title='author' fields={authors} labelKey='name' value={author?.id} onChange={setAuthor} clearable>
      <TextInput
        style={s.input}
        placeholderTextColor={placeholderTextColor}
        onChangeText={setName}
        value={name}
        placeholder={t('common.search').toLowerCase()}
      />
    </EditableListItem>
  );
});

const ds = new DynamicStyleSheet({
  input: {
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
    color: dynamicColor.PrimaryText,
    padding: 0,
    paddingRight: 5,
    paddingVertical: 15,
  } as TextStyle,
});
