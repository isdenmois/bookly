import React from 'react';
import { InputItem } from './input-item';

interface Props {
  value: string;
  onApply: () => void;
  onChange: (type: string, value: any) => void;
}

export class BookTitleFilter extends React.PureComponent<Props> {
  render() {
    return (
      <InputItem
        title='Название'
        keyboardType='default'
        value={this.props.value}
        onChange={this.setTitle}
        onApply={this.props.onApply}
      />
    );
  }

  setTitle = value => this.props.onChange('title', value);
}
