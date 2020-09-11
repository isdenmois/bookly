import React from 'react';
import { observer } from 'mobx-react';
import { formatDate } from 'utils/date';
import { Calendar } from 'components';
import { OpenableListItem } from './openable-list-item';
import { BookFilters } from '../book-filters.service';

interface Props {
  filters: BookFilters;
  onApply: () => void;
}

interface State {
  opened: boolean;
  startDate: Date;
  endDate: Date;
}

export function formatPeriod(period) {
  const value: any = period || {};
  const { from, to } = value;

  return from && to ? `${formatDate(from)} - ${formatDate(to)}` : '';
}

@observer
export class BookDateFilter extends React.PureComponent<Props, State> {
  state: State = { opened: false, startDate: this.props.filters.date?.from, endDate: this.props.filters.date?.to };

  today = new Date();
  calendar: any;

  render() {
    const date = formatPeriod(this.props.filters.date);

    return (
      <OpenableListItem title='modal.date' viewValue={date} onClear={this.clear} onClose={this.resetState}>
        <Calendar
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          maxDate={this.today}
          onChange={this.onChange}
        />
      </OpenableListItem>
    );
  }

  onChange = ({ startDate, endDate }) => {
    this.setState({ startDate, endDate });

    if (endDate) {
      this.setDate(startDate, endDate);
    }
  };

  setDate = (from: Date, to: Date) => {
    this.props.filters.setFilter('date', { from, to });
    this.props.filters.setFilter('year', null);
  };

  clear = () => this.props.filters.setFilter('date', null);
  resetState = () => this.setState({ startDate: null, endDate: null });
}
