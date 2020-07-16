import React, { useState, useCallback, useMemo } from 'react';
import _ from 'lodash';
import { Text, TextInput, TouchableOpacity, TextStyle, ViewStyle, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { withNavigationProps } from 'utils/with-navigation-props';
import { Dialog, Button } from 'components';
import Book from 'store/book';
import { NavigationStackProp } from 'react-navigation-stack';
import { BookExtended } from 'types/book-extended';
import { dynamicColor, useSColor } from 'types/colors';
import { t } from 'services';
import { DynamicStyleSheet } from 'react-native-dynamic';

interface Props {
  book: Book & BookExtended;
  navigation: NavigationStackProp;
}

const TITLE_SEPARATOR = /\s*;\s*/g;

export const BookTitleEditModal = withNavigationProps()(({ book, navigation }: Props) => {
  const [title, setTitle] = useState(book.title);
  const update = useCallback(() => updateTitle(navigation, book, title), [title]);
  const titles: string[] = useMemo(() => getTitles(book.otherTitles, book.title, book.originalTitle), []);
  const enabled = title && title.trim() !== book.title;
  const onPress = enabled ? update : null;
  const isLiveLib = book.id.startsWith('l_');
  const { s, color } = useSColor(ds);

  return (
    <Dialog style={s.dialog} title={t('modal.edit')} onApply={onPress}>
      <TextInput
        style={s.input}
        value={title}
        returnKeyType='done'
        placeholder={t('modal.enter-title')}
        onChangeText={setTitle}
        onSubmitEditing={onPress}
      />

      {!isLiveLib && (
        <ScrollView>
          {titles.map(t => (
            <TouchableOpacity key={t} style={s.line} onPress={() => setTitle(t)}>
              <Icon name='chevron-right' size={14} color={color.PrimaryText} />
              <Text style={s.text}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <Button style={s.button} label={t('button.apply')} disabled={!enabled} onPress={onPress} />
    </Dialog>
  );
});

function updateTitle(navigation: NavigationStackProp, book: Book, title: string) {
  const search = _.uniq((book.search || '').split(TITLE_SEPARATOR).concat(title)).join(';');

  navigation.goBack();
  book.setData({ title, search });
}

function getTitles(otherTitles: string, title: string, originalTitle: string) {
  const allTitles = [title].concat((otherTitles || '').split(TITLE_SEPARATOR));

  if (originalTitle) {
    allTitles.unshift(originalTitle);
  }

  return _.uniq(allTitles);
}

const ds = new DynamicStyleSheet({
  dialog: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  } as ViewStyle,
  input: {
    fontSize: 14,
    color: dynamicColor.PrimaryText,
    paddingHorizontal: 0,
    paddingVertical: 10,
    margin: 0,
  } as TextStyle,
  line: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
  } as ViewStyle,
  text: {
    fontSize: 14,
    lineHeight: 16,
    color: dynamicColor.PrimaryText,
    marginLeft: 10,
  } as TextStyle,
  button: {
    marginTop: 20,
  } as ViewStyle,
});
