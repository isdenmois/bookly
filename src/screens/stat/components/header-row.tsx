import React, { memo } from 'react';
import { Text, View, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { DynamicStyleSheet, useDynamicValue } from 'react-native-dynamic';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { dynamicColor, boldText } from 'types/colors';
import { t } from 'services';
import { Sort } from '../tabs/shared';

interface Props {
  columns: string[];
  fields: string[];
  flexes?: number[];
  sort?: Sort;
  onSort: (field: string) => void;
}

export const HeaderRow = memo(({ columns, fields, flexes, sort, onSort }: Props) => {
  const s = useDynamicValue(ds);

  return (
    <View style={s.container}>
      {columns.map((c, i) => (
        <TouchableOpacity key={c} style={flexes && { flex: flexes[i] }} onPress={() => onSort(fields[i])}>
          <Text key={c} style={s.text}>
            {t(c)}
            {!!sort && sort.field === fields[i] && (
              <Icon style={s.icon} name={sort.asc ? 'sort-alpha-down' : 'sort-alpha-up'} />
            )}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
});

const ds = new DynamicStyleSheet({
  container: {
    flexDirection: 'row',
    marginTop: 20,
    marginHorizontal: 15,
  } as ViewStyle,
  text: {
    color: dynamicColor.PrimaryText,
    fontSize: 16,
    ...boldText,
  } as TextStyle,
  icon: {
    fontSize: 14,
  },
});
