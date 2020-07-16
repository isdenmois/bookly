import React from 'react';
import { Switch, SwitchProps, Platform } from 'react-native';
import { useColor } from 'types/colors';

export function Checkbox({ value, onValueChange, ...props }: SwitchProps) {
  const isWeb = Platform.OS === 'web';
  const color = useColor();
  const thumbColor = isWeb || !value ? color.Empty : color.Primary;

  return (
    <Switch
      value={value}
      onValueChange={isWeb ? null : onValueChange}
      activeThumbColor={color.Primary}
      thumbColor={thumbColor}
      trackColor={{ false: color.LightBackground, true: color.LightBackground }}
      {...props}
    />
  );
}
