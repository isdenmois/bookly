import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle, TextStyle } from 'react-native';
import classnames from 'rn-classnames';
import { color } from 'types/colors';
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

export class Button extends React.Component<Props> {
  render() {
    const { icon, label, thin, disabled, bordered, textStyle } = this.props;
    const viewStyles = [...cn('container', { thin, disabled, bordered })].concat(this.props.style);
    const textStyles = [s.text, ...cn(icon && { icon: !thin, iconThin: thin }, { inversed: bordered }), textStyle];
    const Component: any = disabled ? View : TouchableOpacity;

    return (
      <Component testID={this.props.testID} onPress={!disabled && this.props.onPress} style={viewStyles}>
        {!!icon && icon}
        <TextM style={textStyles}>{label}</TextM>
      </Component>
    );
  }
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: color.Primary,
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
    borderColor: color.Primary,
  } as ViewStyle,
  text: {
    color: color.PrimaryTextInverse,
    fontFamily: 'sans-serif-medium',
    textAlign: 'center',
    lineHeight: 19,
  } as TextStyle,
  inversed: {
    color: color.Primary,
  } as TextStyle,
});
const cn = classnames(s);
