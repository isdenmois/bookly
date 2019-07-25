import React, { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle, TextStyle } from 'react-native';
import classnames from 'rn-classnames';
import { color } from 'types/colors';
import { TextM } from 'components/text';

interface Props {
  value?: string;
  label?: string;
  first?: boolean;
  last?: boolean;
  border?: boolean;
  counter?: ReactNode;
  icon?: ReactNode;
  selected?: ReactNode;
  style?: ViewStyle;
  rowStyle?: ViewStyle;
  onPress?: () => void;
}

export class ListItem extends React.Component<Props> {
  static defaultProps = {
    border: true,
  };

  render() {
    const { style, icon, counter, first, last, border, selected, label } = this.props;

    const Container: any = this.props.onPress ? TouchableOpacity : View;

    return (
      <Container style={[s.container, style]} onPress={this.props.onPress}>
        {!!icon && <View style={s.icon}>{icon}</View>}
        <View style={[...cn({ border, borderFirst: first, borderLast: last }), this.props.rowStyle]}>
          {!!label && <TextM style={s.label}>{label}</TextM>}
          {!this.props.children && <TextM style={cn('text', { textRight: !!label })}>{this.props.value}</TextM>}
          {this.props.children}
          {counter !== undefined && <Text style={s.counter}>{counter}</Text>}
          {selected}
        </View>
      </Container>
    );
  }
}

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  } as ViewStyle,
  border: {
    flexDirection: 'row',
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: color.Border,
    flex: 1,
    paddingHorizontal: 5,
  } as ViewStyle,
  borderFirst: {
    borderTopWidth: 0.5,
    borderTopColor: color.Border,
  } as ViewStyle,
  borderLast: {
    borderBottomWidth: 0,
  } as ViewStyle,
  label: {
    color: color.PrimaryText,
  } as TextStyle,
  text: {
    flex: 1,
    color: color.PrimaryText,
  } as TextStyle,
  textRight: {
    textAlign: 'right',
  } as TextStyle,
  counter: {
    marginLeft: 10,
    color: color.SecondaryText,
  } as TextStyle,
  icon: {
    marginRight: 15,
  } as ViewStyle,
});
const cn = classnames(s);
