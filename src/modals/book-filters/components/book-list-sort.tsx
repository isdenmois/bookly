import React from 'react';
import { getColor } from 'types/colors';
import { TouchIcon } from 'components';
import { EditableListItem } from './editable-list-item';
import { ColorSchemeContext } from 'react-native-dynamic';

const fields = [
  { id: 'date', key: 'modal.date' },
  { id: 'title', key: 'modal.title' },
  { id: 'rating', key: 'modal.rating' },
  { id: 'author', key: 'author' },
  { id: 'id', name: 'id' },
  { id: 'createdAt', key: 'modal.by-add' },
];

interface Props {
  title?: string;
  fields: string[];
  value: any;
  onChange: (params: any) => void;
}

export class BookListSort extends React.PureComponent<Props> {
  static contextType = ColorSchemeContext;

  render() {
    const title = this.props.title || 'modal.sort';
    const color = getColor(this.context);

    return (
      <EditableListItem
        title={title}
        fields={fields}
        value={this.props.value.field}
        labelKey='name'
        onChange={this.setField}
      >
        <TouchIcon
          name={this.props.value.desc ? 'sort-alpha-up' : 'sort-alpha-down'}
          paddingVertical={15}
          paddingLeft={15}
          size={18}
          color={color.PrimaryText}
          onPress={this.toggleDesc}
        />
      </EditableListItem>
    );
  }

  toggleDesc = () => {
    const prev = this.props.value;

    this.props.onChange({ field: prev.field, desc: !prev.desc });
  };

  setField = field => {
    const desc = this.props.value.desc;

    this.props.onChange({ field, desc });
  };
}
