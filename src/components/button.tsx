import React from 'react';
import { TouchableOpacity, View, ViewStyle, TextStyle, Platform } from 'react-native';
import { DynamicStyleSheet, useDynamicValue } from 'react-native-dynamic';
import classnames from 'rn-classnames';
import { dynamicColor, boldText } from 'types/colors';
import { TextM } from 'components/text';

interface Props {
  label: string;
  icon?: any;
  thin?: boolean;
  disabled?: boolean;
  bordered?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  testID?: string;
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
      <TextM style={textStyles}>{label}</TextM>
    </Component>
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
    paddingHorizontal: 10,
    paddingVertical: 5,
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
