import React, { ReactNode } from 'react';
import { Text, TouchableOpacity, View, ViewStyle, TextStyle, KeyboardTypeOptions, TextInput } from 'react-native';
import { ColorSchemeContext, DynamicStyleSheet, DynamicValue } from 'react-native-dynamic';
import classnames from 'rn-classnames';
import { light, dark, dynamicColor } from 'types/colors';
import { TextM } from './text';
import { TouchIcon } from './touch-icon';
import { t } from 'services';

interface Props {
  value?: string;
  label?: string;
  first?: boolean;
  last?: boolean;
  opened?: boolean;
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
  onLongPress?: () => void;
  onChange?: (text: string) => void;
  onSubmit?: () => void;
  onBlur?: () => void;
}

export class ListItem extends React.Component<Props> {
  static contextType = ColorSchemeContext;

  static defaultProps = {
    border: true,
  };

  input: TextInput;

  render() {
    const { style, icon, counter, first, opened, border, selected, label, disabled, children, testID } = this.props;
    const isEditable = Boolean(this.props.onChange);
    const Container: any = (this.props.onPress || isEditable) && !disabled && !opened ? TouchableOpacity : View;
    const s = ds[this.context];
    const cn = classnames(s);
    const color = this.context === 'dark' ? dark : light;

    return (
      <Container
        style={[s.container, style]}
        onPress={this.onPress}
        onLongPress={this.props.onLongPress}
        testID={counter || isEditable ? null : testID}
      >
        {!!icon && <View style={s.icon}>{icon}</View>}
        <View style={[...cn({ border, borderFirst: first, disabled }), this.props.rowStyle]}>
          {!!label && <TextM style={s.label}>{t(label)}</TextM>}
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

const ds = new DynamicStyleSheet({
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
    borderTopColor: dynamicColor.Border,
  },
  label: {
    color: dynamicColor.PrimaryText,
  },
  text: {
    flex: 1,
    color: dynamicColor.PrimaryText,
    padding: 0,
    margin: 0,
    height: 20,
  },
  textRight: {
    textAlign: 'right',
  } as TextStyle,
  counter: {
    marginLeft: 10,
    color: dynamicColor.SecondaryText,
  },
  icon: {
    marginRight: 15,
  } as ViewStyle,
  disabled: {
    opacity: 0.3,
  } as ViewStyle,
});
