import React from 'react';
import _ from 'lodash';
import { Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { color } from 'types/colors';
import { ListItem, TouchIcon } from 'components';
import { SelectList } from './select-list';
import Author from 'store/author';

type Field = string | Author;

interface Props {
  title: string;
  fields: any[];
  labelKey?: string;
  value?: string;
  clearable?: boolean;
  onChange?: (value: string) => void;
}

export class EditableListItem extends React.Component<Props> {
  state = { edit: false };

  fields = this.props.labelKey ? null : _.map(this.props.fields, (label, id) => ({ id, label }));

  get label() {
    const { fields, labelKey, value: id } = this.props;
    if (!labelKey) {
      return fields[id];
    }
    const obj = _.find(fields, { id } as any);

    return obj && obj[labelKey];
  }

  render() {
    const { title, value, clearable, labelKey } = this.props;
    const options = this.fields || this.props.fields;
    const edit = this.state.edit;

    return (
      <ListItem
        label={edit ? null : title}
        value={value}
        clearable={clearable && !edit}
        onPress={edit ? null : this.startEdit}
        onChange={this.props.onChange}
      >
        {edit && (
          <SelectList
            title={title}
            labelKey={labelKey}
            fields={options}
            value={value}
            onChange={this.setValue}
            onClose={this.close}
          >
            {this.props.children}
          </SelectList>
        )}
        {!edit && <Text style={s.value}>{this.label}</Text>}
      </ListItem>
    );
  }

  close = () => this.setState({ edit: false });

  setValue = value => {
    this.props.onChange(value);
    this.close();
  };

  startEdit = () => this.setState({ edit: true });
}

const s = StyleSheet.create({
  value: {
    fontSize: 16,
    color: color.PrimaryText,
    flex: 1,
    textAlign: 'right',
  } as TextStyle,
});
