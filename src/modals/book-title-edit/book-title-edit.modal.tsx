import React, { useState, useCallback } from 'react';
import _ from 'lodash';
import { StyleSheet, ViewStyle } from 'react-native';
import { withNavigationProps } from 'utils/with-navigation-props';
import { Dialog, Button } from 'components';
import Book from 'store/book';
import { NavigationStackProp } from 'react-navigation-stack';
import { BookExtended } from 'types/book-extended';
import { t } from 'services';
import { TitleEdit } from 'modals/book-editor/components/title-edit';
import { ScrollView } from 'react-native-gesture-handler';

interface Props {
  book: Book & BookExtended;
  navigation: NavigationStackProp;
}

const TITLE_SEPARATOR = /\s*;\s*/g;

export const BookTitleEditModal = withNavigationProps()(({ book, navigation }: Props) => {
  const [title, setTitle] = useState(book.title);
  const update = useCallback(() => updateTitle(navigation, book, title), [title]);
  const enabled = title && title.trim() !== book.title;
  const onPress = enabled ? update : null;

  return (
    <Dialog style={s.dialog} title='modal.edit' onApply={onPress}>
      <ScrollView>
        <TitleEdit book={book} title={title} onTitleChange={setTitle} onSubmit={onPress} />
      </ScrollView>

      <Button style={s.button} label={t('button.apply')} disabled={!enabled} onPress={onPress} />
    </Dialog>
  );
});

function updateTitle(navigation: NavigationStackProp, book: Book, title: string) {
  const search = _.uniq((book.search || '').split(TITLE_SEPARATOR).concat(title)).join(';');

  navigation.goBack();
  book.setData({ title, search });
}

const s = StyleSheet.create({
  dialog: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  } as ViewStyle,
  button: {
    marginTop: 20,
  } as ViewStyle,
});
