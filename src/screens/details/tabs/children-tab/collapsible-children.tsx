import React, { memo, useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, TextStyle, ViewStyle } from 'react-native';
import { ChildBook } from 'types/book-extended';
import { dynamicColor, getColor, useSColor } from 'types/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TouchIcon } from 'components';
import { DynamicStyleSheet } from 'react-native-dynamic';
import { MainRoutes } from 'navigation/routes';
import { getNavigation } from 'services';

interface Props {
  book: ChildBook;
}

export const CollapsibleChildren = memo<Props>(({ book }) => {
  const [collapsed, setCollapsed] = useState(true);
  const openBook = useCallback(() => getNavigation().push(MainRoutes.Details, { bookId: String(book.id) }), []);
  const toggleCollapse = useCallback(() => setCollapsed(!collapsed), [collapsed, setCollapsed]);
  const Touch: any = book.id ? TouchableOpacity : View;
  const { s, color } = useSColor(ds);

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
            <CollapsibleChildren key={c.id || c.title} book={c} />
          ))}
        </View>
      )}
    </>
  );
});

function getChildBookTitle(book: ChildBook) {
  if (book.year) {
    return `${book.title} (${book.year})`;
  }

  return book.title;
}

const ds = new DynamicStyleSheet({
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
    color: dynamicColor.SecondaryText,
    fontSize: 12,
  } as TextStyle,
  touch: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  value: {
    color: dynamicColor.PrimaryText,
    fontSize: 18,
    marginRight: 5,
    flex: 1,
  } as TextStyle,
  children: {
    paddingLeft: 28,
  } as ViewStyle,
});
