import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { NavigationStackProp } from 'react-navigation-stack';
import { ChildBook } from 'types/book-extended';
import { color } from 'types/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TouchIcon } from 'components';

interface Props {
  book: ChildBook;
  navigation: NavigationStackProp;
}

export function CollapsibleChildren({ book, navigation }: Props) {
  const [collapsed, setCollapsed] = useState(true);
  const openBook = useCallback(() => navigation.push('Details', { bookId: String(book.id) }), []);
  const toggleCollapse = useCallback(() => setCollapsed(!collapsed), [collapsed, setCollapsed]);
  const Touch: any = book.id ? TouchableOpacity : View;

  return (
    <>
      <View style={s.row}>
        {!!book.children && (
          <TouchIcon
            style={s.collapseIcon}
            name={collapsed ? 'plus-square' : 'minus'}
            size={18}
            color={color.BlueIcon}
            onPress={toggleCollapse}
          />
        )}

        <View style={s.data}>
          <Text style={s.title}>{book.type}</Text>
          <Touch onPress={openBook} style={s.touch}>
            <Text style={s.value}>{getChildBookTitle(book)}</Text>
            {!!book.id && <Icon name='chevron-right' size={18} color={color.SecondaryText} />}
          </Touch>
        </View>
      </View>

      {!collapsed && (
        <View style={s.children}>
          {book.children.map(c => (
            <CollapsibleChildren key={c.id || c.title} book={c} navigation={navigation} />
          ))}
        </View>
      )}
    </>
  );
}

function getChildBookTitle(book) {
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
  } as ViewStyle,
  data: {
    flexDirection: 'column',
    alignItems: 'stretch',
    flex: 1,
  } as ViewStyle,
  title: {
    color: color.SecondaryText,
    fontSize: 12,
  } as TextStyle,
  touch: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  value: {
    color: color.PrimaryText,
    fontSize: 18,
    marginRight: 5,
    flex: 1,
  } as TextStyle,
  children: {
    paddingLeft: 28,
  } as ViewStyle,
});
