import React from 'react';
import { TextInput, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { color } from 'types/colors';
import { ListItem } from 'components/list-item';
import { TouchIcon } from 'components/touch-icon';

interface Props {
  value: string;
  onApply: () => void;
  onChange: (type: string, value: any) => void;
}

export class BookYearFilter extends React.PureComponent<Props> {
  render() {
    const value = this.props.value || '';

    return (
      <ListItem rowStyle={s.list} label='Год'>
        <TextInput
          style={s.input}
          returnKeyType='done'
          keyboardType='numeric'
          value={value.toString()}
          onChangeText={this.setYear}
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

  clear = () => this.props.onChange('year', null);

  setYear = value => {
    if (!value || +value) {
      this.props.onChange('year', +value || null);
      this.props.onChange('date', null);
    }
  };
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
