import React, { FC, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { dark, color } from 'types/colors';

export const StatusBarColor: FC = () => {
  const isDark = useDarkMode();

  const barStyle = isDark ? 'light-content' : 'dark-content';
  const backgroundColor = isDark ? dark.Background : color.Background;

  useEffect(() => {
    changeNavigationBarColor(backgroundColor, !isDark, false);
  }, [backgroundColor, isDark]);

  return <StatusBar backgroundColor={backgroundColor} barStyle={barStyle} />;
};
