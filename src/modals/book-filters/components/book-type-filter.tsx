import React from 'react';
import { BOOK_TYPES } from 'types/book-types';
import { EditableListItem } from './editable-list-item';

interface Props {
  value: any;
  onChange: (type: string, value: any) => void;
}

export class BookTypeFilter extends React.Component<Props> {
  render() {
    return (
      <EditableListItem
        title='Тип книги'
        fields={BOOK_TYPES as any}
        value={this.props.value}
        onChange={this.setType}
        clearable
      />
    );
  }

  setType = value => {
    this.props.onChange('type', value);
  };
}
