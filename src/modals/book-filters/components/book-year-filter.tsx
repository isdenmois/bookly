import React from 'react';
import { InputItem } from './input-item';

interface Props {
  value: string;
  onApply: () => void;
  onChange: (type: string, value: any) => void;
}

export class BookYearFilter extends React.PureComponent<Props> {
  render() {
    return (
      <InputItem
        title='Год'
        keyboardType='numeric'
        value={this.props.value}
        onChange={this.setYear}
        onApply={this.props.onApply}
      />
    );
  }

  setYear = value => {
    if (!value || +value) {
      this.props.onChange('year', +value || null);
      this.props.onChange('date', null);
    }
  };
}
