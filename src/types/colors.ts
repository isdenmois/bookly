import { DynamicValue, useDarkModeContext } from 'react-native-dynamic';
import { Platform } from 'react-native';

export const color = {
  Black: '#000',
  Red: '#F44336',

  PrimaryText: '#000',
  PrimaryTextInverse: '#FFF',
  SecondaryText: '#757575',
  ErrorText: '#F44336',
  DisabledText: '#B8B8B8',

  Background: '#FFFFFF',
  DialogBackground: '#FFF',
  OrangeBackground: '#FFE0B2',
  SearchBackground: '#F5F5F5',
  LightBackground: '#EEE',
  BookItem: '#FFF',

  Primary: '#009688',
  Secondary: '#F57C00',
  Empty: '#90A4AE',
  Stars: '#FF9032',
  Border: '#E0E0E0',
  BlueIcon: '#0D47A1',
  Review: '#454754',
  ReadMore: '#4E342E',
};

export const light = color;

export const dark = {
  Red: '#F44336',

  PrimaryText: '#FAFAFB',
  PrimaryTextInverse: '#FAFAFB',
  SecondaryText: '#898993',
  ErrorText: '#F44336',
  DisabledText: '#47474D',

  Background: '#13131A',
  DialogBackground: '#22222F',
  OrangeBackground: '#1B976D',
  SearchBackground: '#292932',
  LightBackground: '#3F434A',
  BookItem: '#1F2125',

  Primary: '#DF6448',
  Secondary: '#F0F0F0',
  Empty: '#8E8E98',
  // Stars: '#FFC542',
  Stars: '#FAFAFB',
  Border: '#404040',
  BlueIcon: '#357AE9',
  Review: '#F4EDEA',
  ReadMore: '#8E8E98',
};

type Color = typeof color | typeof dark;

export function getColor(mode): Color {
  return mode === 'dark' ? dark : light;
}

export const dynamicColor: Color = {} as any;
for (let name in dark) {
  dynamicColor[name] = new DynamicValue(light[name], dark[name]);
}

export function useSColor(ds) {
  const mode = useDarkModeContext();

  return { s: ds[mode], color: getColor(mode) };
}

export function useColor() {
  const mode = useDarkModeContext();

  return getColor(mode);
}

export const boldText: any = Platform.select({
  web: {
    fontWeight: 600,
  },
  default: {
    fontFamily: 'sans-serif-medium',
  },
});

export const lightText: any = Platform.select({
  web: {
    fontWeight: 300,
  },
  default: {
    fontFamily: 'sans-serif-light',
  },
});
