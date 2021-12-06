import React, { FC, useMemo } from 'react';
import { Svg, Path } from 'react-native-svg';
import { Platform, StyleSheet } from 'react-native';
import _ from 'lodash';

const pathCreator = () =>
  _.times(
    7,
    i => `M 0 ${i * 2} l ${15 - i * 2} 0 a 20 20 0 0 1 20 20 l 0 ${184 - 2 * i * 2} a 20 20 0 0 1 -20 20`,
  ).join(' ');

export const BookEdge: FC = () => {
  const d = useMemo(pathCreator, []);

  return (
    <Svg height={224} width={38} style={s.svg}>
      <Path d={d} stroke='#DDD' strokeWidth={0.5} />
    </Svg>
  );
};

const s = StyleSheet.create({
  svg: {
    marginLeft: -20,
    zIndex: 0,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#F3F4F1',
    ...Platform.select({
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '2px 4px 12px rgb(0 0 0 / 25%)',
      },
    }),
  },
});
