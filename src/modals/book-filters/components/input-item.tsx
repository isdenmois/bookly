import React from 'react';
import { TextInput, StyleSheet, ViewStyle, TextStyle, KeyboardTypeOptions } from 'react-native';
import { color } from 'types/colors';
import { ListItem, TouchIcon } from 'components';

interface Props {
  title: string;
  value: string;
  onApply: () => void;
  onChange: (value: string) => void;
  keyboardType: KeyboardTypeOptions;
}

export class InputItem extends React.PureComponent<Props> {
  render() {
    const value = this.props.value || '';

    return (
      <ListItem rowStyle={s.list} label={this.props.title}>
        <TextInput
          style={s.input}
          returnKeyType='done'
          value={value.toString()}
          onChangeText={this.props.onChange}
          onSubmitEditing={this.props.onApply}
        />
        {!!value && (
          <TouchIcon
            paddingVertical={15}
            paddingLeft={10}
            name='times'
            size={20}
            color={color.PrimaryText}
            onPress={this.clear}
          />
        )}
      </ListItem>
    );
  }

  clear = () => this.props.onChange(null);
}

const s = StyleSheet.create({
  list: {
    paddingVertical: 0,
  } as ViewStyle,
  input: {
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
    color: color.PrimaryText,
    padding: 0,
    paddingRight: 5,
    paddingVertical: 15,
  } as TextStyle,
});
