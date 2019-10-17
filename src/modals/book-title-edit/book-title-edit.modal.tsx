import React, { useState, useCallback, useMemo } from 'react';
import _ from 'lodash';
import { Text, TextInput, TouchableOpacity, StyleSheet, TextStyle, ViewStyle, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { withNavigationProps } from 'utils/with-navigation-props';
import { Dialog, Button } from 'components';
import Book from 'store/book';
import { NavigationStackProp } from 'react-navigation-stack';
import { BookExtended } from 'types/book-extended';
import { color } from 'types/colors';

interface Props {
  book: Book & BookExtended;
  navigation: NavigationStackProp;
}

const TITLE_SEPARATOR = /\s*;\s*/g;

export const BookTitleEditModal = withNavigationProps()(({ book, navigation }: Props) => {
  const [title, setTitle] = useState(book.title);
  const update = useCallback(() => updateTitle(navigation, book, title), [title]);
  const titles: string[] = useMemo(() => getTitles(book.otherTitles, book.title), []);
  const enabled = title && title.trim() !== book.title;
  const onPress = enabled ? update : null;
  const isLiveLib = book.id.startsWith('l_');

  return (
    <Dialog style={s.dialog} title='Редактирование' onApply={onPress}>
      <TextInput
        style={s.input}
        value={title}
        returnKeyType='done'
        placeholder='Введите название книги'
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

      <Button style={s.button} label='Сохранить' disabled={!enabled} onPress={onPress} />
    </Dialog>
  );
});

function updateTitle(navigation: NavigationStackProp, book: Book, title: string) {
  const search = _.uniq((book.search || '').split(TITLE_SEPARATOR).concat(title)).join(';');

  navigation.goBack();
  book.setData({ title, search });
}

function getTitles(otherTitles: string, title: string) {
  const allTitles = [title].concat((otherTitles || '').split(TITLE_SEPARATOR));

  return _.uniq(allTitles);
}

const s = StyleSheet.create({
  dialog: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  } as ViewStyle,
  input: {
    fontSize: 14,
    color: color.PrimaryText,
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
    color: color.PrimaryText,
    marginLeft: 10,
  } as TextStyle,
  button: {
    marginTop: 20,
  } as ViewStyle,
});
