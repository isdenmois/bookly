import React, { FC } from 'react';
import { Svg, Path } from 'react-native-svg';
import { Platform, StyleSheet } from 'react-native';

export const BookEdge: FC = () => {
  return (
    <Svg height={224} width={38} style={s.svg}>
      <Path
        d='M 0 0 l 15 0 a 20 20 0 0 1 20 20 l 0 184 a 20 20 0 0 1 -20 20 l -15 0'
        fill='#F3F4F1'
        stroke='#DDD'
        strokeWidth={0.5}
      />
      <Path
        d='M 0 0 l 13 0 a 20 20 0 0 1 20 20 l 0 184 a 20 20 0 0 1 -20 20 l -13 0'
        fill='#F3F4F1'
        stroke='#DDD'
        strokeWidth={0.5}
      />
      <Path
        d='M 0 0 l 11 0 a 20 20 0 0 1 20 20 l 0 184 a 20 20 0 0 1 -20 20 l -11 0'
        fill='#F3F4F1'
        stroke='#DDD'
        strokeWidth={0.5}
      />
      <Path
        d='M 0 0 l 9 0 a 20 20 0 0 1 20 20 l 0 184 a 20 20 0 0 1 -20 20 l -9 0'
        fill='#F3F4F1'
        stroke='#DDD'
        strokeWidth={0.5}
      />
      <Path
        d='M 0 0 l 7 0 a 20 20 0 0 1 20 20 l 0 184 a 20 20 0 0 1 -20 20 l -7 0'
        fill='#F3F4F1'
        stroke='#DDD'
        strokeWidth={0.5}
      />
      <Path
        d='M 0 0 l 5 0 a 20 20 0 0 1 20 20 l 0 184 a 20 20 0 0 1 -20 20 l -5 0'
        fill='#F3F4F1'
        stroke='#DDD'
        strokeWidth={0.5}
      />
      <Path
        d='M 0 0 l 3 0 a 20 20 0 0 1 20 20 l 0 184 a 20 20 0 0 1 -20 20 l -3 0'
        fill='#F3F4F1'
        stroke='#DDD'
        strokeWidth={0.5}
      />
      <Path
        d='M 0 0 l 1 0 a 20 20 0 0 1 20 20 l 0 184 a 20 20 0 0 1 -20 20 l -1 0'
        fill='#F3F4F1'
        stroke='#DDD'
        strokeWidth={0.5}
      />
    </Svg>
  );
};

const s = StyleSheet.create({
  svg: {
    marginLeft: -20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
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
