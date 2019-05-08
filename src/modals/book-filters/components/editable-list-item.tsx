import React from 'react';
import _ from 'lodash';
import { Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ListItem } from 'components/list-item';
import { TouchIcon } from 'components/touch-icon';
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
      <ListItem rowStyle={s.listItem} label={edit ? null : title} onPress={edit ? null : this.startEdit}>
        {edit && (
          <SelectList title={title} labelKey={labelKey} fields={options} value={value} onChange={this.setValue}>
            {this.props.children}
          </SelectList>
        )}
        {!edit && <Text style={s.value}>{this.label}</Text>}
        {clearable && !edit && !!value && (
          <TouchIcon paddingVertical={15} paddingLeft={10} name='times' size={20} color='#000' onPress={this.clear} />
        )}
      </ListItem>
    );
  }

  clear = () => this.props.onChange(null);

  setValue = value => {
    this.props.onChange(value);
    this.setState({ edit: false });
  };

  startEdit = () => this.setState({ edit: true });
}

const s = StyleSheet.create({
  listItem: {
    paddingVertical: 0,
  } as ViewStyle,
  value: {
    fontSize: 16,
    color: 'black',
    flex: 1,
    textAlign: 'right',
    paddingVertical: 15,
  } as TextStyle,
});
