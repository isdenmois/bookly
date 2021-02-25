import React, { useMemo, FC } from 'react';
import { Text, TextInput, TouchableOpacity, TextStyle, ViewStyle, ScrollView, View } from 'react-native';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Book from 'store/book';
import { BookExtended } from 'types/book-extended';
import { dynamicColor, useSColor } from 'types/colors';
import { t } from 'services';
import { DynamicStyleSheet } from 'react-native-dynamic';

interface Props {
  book: Book & BookExtended;
  title: string;
  onTitleChange: (title: string) => void;
  onSubmit: () => void;
}

const TITLE_SEPARATOR = /\s*;\s*/g;

export const TitleEdit: FC<Props> = ({ book, title, onTitleChange, onSubmit }) => {
  const titles: string[] = useMemo(() => getTitles(book.otherTitles, book.title, book.originalTitle), []);
  const isLiveLib = book.id.startsWith('l_');
  const { s, color } = useSColor(ds);

  return (
    <View>
      <TextInput
        style={s.input}
        value={title}
        returnKeyType='done'
        placeholder={t('modal.enter-title')}
        onChangeText={onTitleChange}
        onSubmitEditing={onSubmit}
      />

      {!isLiveLib &&
        titles.map(title => (
          <TouchableOpacity key={title} style={s.line} onPress={() => onTitleChange(title)}>
            <Icon name='chevron-right' size={14} color={color.PrimaryText} />
            <Text style={s.text}>{title}</Text>
          </TouchableOpacity>
        ))}
    </View>
  );
};

function getTitles(otherTitles: string, title: string, originalTitle: string) {
  const allTitles = [title].concat((otherTitles || '').split(TITLE_SEPARATOR));

  if (originalTitle) {
    allTitles.unshift(originalTitle);
  }

  return _.uniq(allTitles);
}

const ds = new DynamicStyleSheet({
  input: {
    fontSize: 18,
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
});
