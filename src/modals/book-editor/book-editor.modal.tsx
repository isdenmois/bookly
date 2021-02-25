import React, { useState, useCallback, useRef } from 'react';
import _ from 'lodash';
import { ViewStyle, StyleSheet, View, ScrollView } from 'react-native';
import { withNavigationProps } from 'utils/with-navigation-props';
import { Dialog, Button, Fetcher } from 'components';
import Book from 'store/book';
import { NavigationStackProp } from 'react-navigation-stack';
import { BookExtended } from 'types/book-extended';
import { api, t } from 'services';
import { TitleEdit } from './components/title-edit';
import { ThumbnailEdit } from './components/thumbnail-edit';

interface Props {
  bookId: string;
  navigation: NavigationStackProp;
}

const TITLE_SEPARATOR = /\s*;\s*/g;

export const BookEditorModal = withNavigationProps()(({ bookId, navigation }: Props) => {
  const book = useRef<Book & BookExtended>(null);

  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  const update = useCallback(() => updateBook(navigation, book.current, title, thumbnail), [title, thumbnail]);
  const onLoad = useCallback(b => ((book.current = b), setTitle(b.title), setThumbnail(b.thumbnail)), []);

  const titleChanged = title && title.trim() !== book.current.title;
  const thumbnailChanged = thumbnail && thumbnail !== book.current.thumbnail;
  const enabled = titleChanged || thumbnailChanged;
  const onPress = enabled ? update : null;
  const isLiveLib = bookId.startsWith('l_');
  const API = isLiveLib ? api.lBook : api.book;

  return (
    <Dialog style={s.dialog} title='modal.edit' onApply={onPress}>
      <Fetcher api={API} bookId={bookId} collection='books' onModelUpdated={onLoad}>
        {book => (
          <ScrollView showsVerticalScrollIndicator={false}>
            <ThumbnailEdit book={book} thumbnail={thumbnail} onThumbnailChange={setThumbnail} />
            <View style={s.span} />
            <TitleEdit book={book} title={title} onTitleChange={setTitle} onSubmit={onPress} />
          </ScrollView>
        )}
      </Fetcher>

      <Button style={s.button} label={t('button.apply')} disabled={!enabled} onPress={onPress} />
    </Dialog>
  );
});

function updateBook(navigation: NavigationStackProp, book: Book, title: string, thumbnail: string) {
  const search = _.uniq((book.search || '').split(TITLE_SEPARATOR).concat(title)).join(';');

  book.setData({ title, search, thumbnail });
  navigation.goBack();
}

const s = StyleSheet.create({
  dialog: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  } as ViewStyle,
  button: {
    marginTop: 20,
  } as ViewStyle,
  span: {
    height: 15,
  },
});
