import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle, TextStyle } from 'react-native';
import cn from 'react-native-classnames';
import { TextM } from 'components/text';

interface Props {
  label: string;
  icon?: any;
  thin?: boolean;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  onPress?: () => void;
}

export class Button extends React.Component<Props> {
  render() {
    const { icon, label, thin, disabled } = this.props;
    const viewStyles = [cn(s, 'container', { thin, disabled })].concat(this.props.style);
    const textStyles = [s.text, cn(s, icon && { icon: !thin, iconThin: thin }), this.props.textStyle];
    const Component: any = disabled ? View : TouchableOpacity;

    return (
      <Component onPress={!disabled && this.props.onPress} style={viewStyles}>
        <>
          {!!icon && icon}
          <TextM style={textStyles}>{label}</TextM>
        </>
      </Component>
    );
  }
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#009688',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
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
    opacity: 0.6,
  } as ViewStyle,
  text: {
    color: 'white',
    fontFamily: 'sans-serif-medium',
    textAlign: 'center',
  } as TextStyle,
});
