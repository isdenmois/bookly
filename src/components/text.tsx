import React, { ReactChild } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

interface Props extends TextProps {
  children: ReactChild;
}

function withStyle(textStyle): any {
  return function ({ style, children, ...props }: Props) {
    return (
      <Text style={[textStyle, style]} {...props}>
        {children}
      </Text>
    );
  };
}

const s = StyleSheet.create({
  xs: {
    fontSize: 11,
  },
  s: {
    fontSize: 12,
  },
  m: {
    fontSize: 16,
  },
  l: {
    fontSize: 21,
  },
  xl: {
    fontSize: 20,
  },
});

export const TextXs = withStyle(s.xs);

export const TextS = withStyle(s.s);

export const TextM = withStyle(s.m);

export const TextL = withStyle(s.l);

export const TextXL = withStyle(s.xl);
