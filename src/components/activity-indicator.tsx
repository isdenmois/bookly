import React from 'react';
import { ActivityIndicator as Indicator } from 'react-native';
import { useTheme } from './theme';

export function ActivityIndicator() {
  const { colors } = useTheme();
  return <Indicator size='large' color={colors.Primary} />;
}
