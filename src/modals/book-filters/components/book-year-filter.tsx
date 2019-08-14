import React from 'react';
import { ListItem } from 'components';

interface Props {
  value: string;
  onApply: () => void;
  onChange: (type: string, value: any) => void;
}

export class BookYearFilter extends React.PureComponent<Props> {
  render() {
    return (
      <ListItem
        label='Год'
        keyboardType='numeric'
        value={this.props.value}
        onChange={this.setYear}
        onSubmit={this.props.onApply}
        clearable
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
