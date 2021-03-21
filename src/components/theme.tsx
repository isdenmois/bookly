import React, { FC } from 'react';
import { useColorScheme } from 'react-native';
import {
  ThemeProvider as ReThemeProvider,
  createBox,
  createText,
  createTheme,
  useTheme as useThemeRN,
} from '@shopify/restyle';
import { dark, light } from 'types/colors';

export const palette = {
  purple: '#5A31F4',
  white: '#FFF',
  black: '#111',
  darkGray: '#333',
  lightGray: '#EEE',
};

export const theme = createTheme({
  spacing: {
    1: 8,
    2: 16,
    3: 24,
    4: 32,
  },
  colors: light,
  breakpoints: {},
  textVariants: {
    title: {
      fontSize: 20,
      lineHeight: 24,
      color: 'PrimaryText',
    },
    body: {
      fontSize: 16,
      color: 'PrimaryText',
    },
    empty: {
      fontSize: 16,
      color: 'Empty',
    },
    small: {
      fontSize: 12,
      lineHeight: 16,
      color: 'SecondaryText',
    },
  },
  cardVariants: {
    primary: {
      backgroundColor: 'primaryCardBackground',
      shadowOpacity: 0.3,
    },
    secondary: {
      backgroundColor: 'secondaryCardBackground',
      shadowOpacity: 0.1,
    },
  },
});

type Theme = typeof theme;

const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    ...dark,
  },
};

export const Box = createBox<Theme>();
export const Text = createText<Theme>();

export const ThemeProvider: FC = ({ children }) => {
  const currentMode = useColorScheme();

  return <ReThemeProvider theme={currentMode === 'dark' ? darkTheme : theme}>{children}</ReThemeProvider>;
};

export const useTheme = () => useThemeRN<Theme>();
