import React, { memo, useCallback, useState } from 'react';
import { View, TouchableOpacity, TextStyle, ViewStyle, StyleSheet } from 'react-native';

import { ChildBook } from 'types/book-extended';
import { TouchIcon } from 'components';

import { Text, useTheme } from 'components/theme';

interface Props {
  book: ChildBook;
  children: any;
  onPress(): void;
  icon: any;
}

export const CollapsibleBookChild = memo<Props>(({ book, children, onPress, icon }) => {
  const [collapsed, setCollapsed] = useState(true);
  const toggleCollapse = useCallback(() => setCollapsed(!collapsed), [collapsed, setCollapsed]);
  const Touch: any = book.id ? TouchableOpacity : View;
  const { colors } = useTheme();

  return (
    <>
      <View style={s.row}>
        {!!book.children && (
          <TouchIcon
            style={s.collapseIcon as any}
            name={collapsed ? 'plus-square' : 'minus'}
            size={18}
            color={colors.BlueIcon}
            onPress={toggleCollapse}
          />
        )}

        <View style={s.data}>
          <Text style={s.title} color='SecondaryText'>
            {book.type}
            {book.author ? `; ${book.author}` : ''}
          </Text>
          <Touch onPress={onPress} style={s.touch}>
            <Text style={s.value}>{getChildBookTitle(book)}</Text>
            {!!book.id && icon}
          </Touch>
        </View>
      </View>

      {!collapsed && <View style={s.children}>{children}</View>}
    </>
  );
});

function getChildBookTitle(book: ChildBook) {
  if (book.year) {
    return `${book.title} (${book.year})`;
  }

  return book.title;
}

const s = StyleSheet.create({
  row: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  } as ViewStyle,
  collapseIcon: {
    paddingRight: 10,
  } as TextStyle,
  data: {
    flexDirection: 'column',
    alignItems: 'stretch',
    flex: 1,
  } as ViewStyle,
  title: {
    fontSize: 12,
  } as TextStyle,
  touch: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  value: {
    fontSize: 18,
    marginRight: 5,
    flex: 1,
  } as TextStyle,
  children: {
    paddingLeft: 28,
  } as ViewStyle,
});
