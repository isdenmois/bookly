import React from 'react';
import { TouchableOpacity, View, ViewStyle, TextStyle } from 'react-native';
import { DynamicStyleSheet, useDynamicValue } from 'react-native-dynamic';
import classnames from 'rn-classnames';
import { createVariant, spacing, useRestyle, VariantProps } from '@shopify/restyle';
import { dynamicColor, boldText } from 'types/colors';
import { TextM } from 'components/text';
import { Theme, Text, theme, TouchableBox } from './theme';

interface Props {
  label: string;
  icon?: any;
  thin?: boolean;
  disabled?: boolean;
  bordered?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  testID?: string;
  textTestID?: string;
  onPress?: () => void;
}

export function Button(props: Props) {
  const s = useDynamicValue(ds);
  const cn = classnames(s);
  const { icon, label, thin, disabled, bordered, textStyle } = props;
  const viewStyles = [...cn('container', { thin, disabled, bordered })].concat(props.style);
  const textStyles = [s.text, ...cn(icon && { icon: !thin, iconThin: thin }, { inversed: bordered }), textStyle];
  const Component: any = disabled ? View : TouchableOpacity;

  return (
    <Component testID={props.testID} onPress={!disabled && props.onPress} style={viewStyles}>
      {!!icon && icon}
      <TextM style={textStyles} testID={props.textTestID}>
        {label}
      </TextM>
    </Component>
  );
}

type Props2 = VariantProps<Theme, 'buttonVariants'> & {
  label: string;
  icon?: any;
  disabled?: boolean;
  textStyle?: TextStyle;
  testID?: string;
  textTestID?: string;
  onPress?: () => void;
};

const buttonVariant = createVariant({ themeKey: 'buttonVariants' });
const restyleFunctions = [buttonVariant as any, spacing];

export function Button2({ icon, label, onPress, disabled, testID, textTestID, variant = 'primary', ...rest }: Props2) {
  const buttonProps = useRestyle(restyleFunctions, { variant, ...rest });

  const textVariant = 'button_' + variant;

  return (
    <TouchableBox testID={testID} {...buttonProps} onPress={!disabled && onPress}>
      {!!icon && icon}

      <Text variant={textVariant} testID={textTestID}>
        {label}
      </Text>
    </TouchableBox>
  );
}

const ds = new DynamicStyleSheet({
  container: {
    flexDirection: 'row',
    backgroundColor: dynamicColor.Primary,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  icon: {
    marginLeft: 10,
  } as ViewStyle,
  iconThin: {
    marginLeft: 6,
  } as ViewStyle,
  thin: {
    paddingVertical: theme.spacing[1],
    paddingHorizontal: theme.spacing[3],
    borderRadius: 15,
  } as ViewStyle,
  disabled: {
    opacity: 0.4,
  } as ViewStyle,
  bordered: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: dynamicColor.Primary,
  } as ViewStyle,
  text: {
    color: dynamicColor.PrimaryTextInverse,
    textAlign: 'center',
    lineHeight: 19,
    ...boldText,
  } as TextStyle,
  inversed: {
    color: dynamicColor.Primary,
  } as TextStyle,
});
