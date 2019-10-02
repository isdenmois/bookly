import React, { memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import _ from 'lodash';
import { Tag } from 'components';

interface Props {
  sort: string;
  onChange: (sort: string) => void;
}

const sorts = {
  '-year': 'Год',
  year: 'Год',
  '-copies': 'Тираж',
  copies: 'Тираж',
};

export const EditionsSort = memo(({ sort, onChange }: Props) => {
  return (
    <View style={s.container}>
      {_.map(sorts, (title, key) => (
        <Tag
          key={key}
          title={title}
          icon={key[0] === '-' ? 'sort-alpha-up' : 'sort-alpha-down'}
          selected={sort === key}
          onPress={() => onChange(key)}
          outline
        />
      ))}
    </View>
  );
});

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
  } as ViewStyle,
});
