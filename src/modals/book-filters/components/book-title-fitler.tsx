import React from 'react';
import { ListItem } from 'components';

interface Props {
  value: string;
  onApply: () => void;
  onChange: (type: string, value: any) => void;
}

export class BookTitleFilter extends React.PureComponent<Props> {
  render() {
    return (
      <ListItem
        label='Название'
        keyboardType='default'
        value={this.props.value}
        onChange={this.setTitle}
        onSubmit={this.props.onApply}
        clearable
      />
    );
  }

  setTitle = value => this.props.onChange('title', value);
}
