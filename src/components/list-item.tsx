import React, { ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
  TextInput,
} from 'react-native';
import classnames from 'rn-classnames';
import { color } from 'types/colors';
import { TextM } from './text';
import { TouchIcon } from './touch-icon';

interface Props {
  value?: string;
  label?: string;
  first?: boolean;
  last?: boolean;
  border?: boolean;
  counter?: ReactNode;
  icon?: ReactNode;
  selected?: ReactNode;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: any;
  autoFocus?: any;
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  rowStyle?: ViewStyle;
  testID?: string;
  onPress?: () => void;
  onChange?: (text: string) => void;
  onSubmit?: () => void;
  onBlur?: () => void;
}

export class ListItem extends React.Component<Props> {
  static defaultProps = {
    border: true,
  };

  input: TextInput;

  render() {
    const { style, icon, counter, first, border, selected, label, disabled, children, testID } = this.props;
    const isEditable = Boolean(this.props.onChange);
    const Container: any = (this.props.onPress || isEditable) && !disabled ? TouchableOpacity : View;

    return (
      <Container style={[s.container, style]} onPress={this.onPress} testID={counter || isEditable ? null : testID}>
        {!!icon && <View style={s.icon}>{icon}</View>}
        <View style={[...cn({ border, borderFirst: first, disabled }), this.props.rowStyle]}>
          {!!label && <TextM style={s.label}>{label}</TextM>}
          {!children && !isEditable && <TextM style={cn('text', { textRight: !!label })}>{this.props.value}</TextM>}
          {!children && isEditable && (
            <TextInput
              style={cn('text', { textRight: !!label })}
              value={(this.props.value || '').toString()}
              returnKeyType='done'
              keyboardType={this.props.keyboardType}
              placeholder={this.props.placeholder}
              onChangeText={this.props.onChange}
              onBlur={this.props.onBlur}
              onSubmitEditing={this.props.onSubmit}
              autoCapitalize={this.props.autoCapitalize}
              ref={this.setRef}
              testID={testID}
            />
          )}
          {children}
          {counter !== undefined && (
            <Text style={s.counter} testID={testID}>
              {counter}
            </Text>
          )}
          {selected}
          {!!this.props.clearable && !!this.props.value && (
            <TouchIcon paddingLeft={10} name='times' size={20} color={color.PrimaryText} onPress={this.clear} />
          )}
        </View>
      </Container>
    );
  }

  focus() {
    if (this.input) {
      this.input.focus();
    }
  }

  setRef = ref => (this.input = ref);

  onPress = () => {
    this.focus();
    this.props.onPress?.();
  };

  clear = () => {
    this.focus();

    this.props.onChange(null);
  };
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
    flex: 1,
    paddingHorizontal: 5,
  } as ViewStyle,
  borderFirst: {
    borderTopWidth: 0.5,
    borderTopColor: color.Border,
  } as ViewStyle,
  label: {
    color: color.PrimaryText,
  } as TextStyle,
  text: {
    flex: 1,
    color: color.PrimaryText,
    padding: 0,
    margin: 0,
    height: 20,
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
  disabled: {
    opacity: 0.3,
  } as ViewStyle,
});
const cn = classnames(s);
