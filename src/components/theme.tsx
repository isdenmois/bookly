import React, { FC } from 'react';
import { Platform, TouchableOpacity, TouchableOpacityProps, useColorScheme } from 'react-native';
import {
  ThemeProvider as ReThemeProvider,
  createBox,
  createText,
  createTheme,
  useTheme as useThemeRN,
} from '@shopify/restyle';
import { dark, light } from 'types/colors';

export const theme = createTheme({
  spacing: {
    1: 8,
    2: 16,
    3: 24,
    4: 32,
    5: 40,
    6: 48,
  },
  colors: light,
  breakpoints: {},
  textVariants: {
    defaults: {
      color: 'PrimaryText',
    },
    title: {
      fontSize: 20,
      lineHeight: 24,
    },
    body: {
      fontSize: 16,
    },
    empty: {
      fontSize: 16,
      color: 'empty',
    },
    small: {
      fontSize: 12,
      lineHeight: 16,
    },
    medium: {
      ...Platform.select({
        web: {
          fontWeight: 600,
        },
        default: {
          fontFamily: 'sans-serif-medium',
        },
      }),
    },
    tile: {
      fontSize: 18,
      lineHeight: 18,
      color: 'notBlack',
    },

    button_primary: {},
    button_outlined: {},
    button_inverted: {
      fontSize: 16,
      color: 'PrimaryText',
    },
  },
  buttonVariants: {
    defaults: {
      borderRadius: 5,
      px: 2,
      py: 1,
    },
    primary: {
      backgroundColor: 'Primary',
    },
    outlined: {},
    inverted: {
      backgroundColor: 'grey10',
    },
  },
});

export type Theme = typeof theme;

const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    ...dark,
  },
};

export const Box = createBox<Theme>();
export const TouchableBox = createBox<Theme, TouchableOpacityProps>(TouchableOpacity);
export const Text = createText<Theme>();

export const ThemeProvider: FC = ({ children }) => {
  const currentMode = useColorScheme();

  return <ReThemeProvider theme={currentMode === 'dark' ? darkTheme : theme}>{children}</ReThemeProvider>;
};

export const useTheme = () => useThemeRN<Theme>();
