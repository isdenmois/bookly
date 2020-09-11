import React, { Component } from 'react';
import Month from './month';

interface RangeType {
  startDate: Date;
  endDate: Date;
}

interface Props {
  disableRange?: boolean;
  startDate?: Date;
  endDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  onChange: (range: RangeType) => void;
}

interface State {
  startDate?: Date;
  endDate?: Date;
  month: Date;
}

export class Calendar extends Component<Props, State> {
  state: State = {
    startDate: this.props.startDate,
    endDate: this.props.endDate,
    month: this.props.startDate || new Date(),
  };

  handlePressDay = (date: Date) => {
    const { startDate, endDate } = this.state;
    let newStartDate;
    let newEndDate;

    if (this.props.disableRange) {
      newStartDate = date;
      newEndDate = undefined;
    } else if (startDate) {
      if (endDate) {
        newStartDate = date;
        newEndDate = undefined;
      } else if (date < startDate!) {
        newStartDate = date;
        newEndDate = startDate;
      } else if (date > startDate!) {
        newStartDate = startDate;
        newEndDate = date;
      } else {
        newStartDate = date;
        newEndDate = date;
      }
    } else {
      newStartDate = date;
    }

    const newRange = {
      startDate: newStartDate as Date,
      endDate: newEndDate,
    };

    this.setState(newRange, () => this.props.onChange(newRange));
  };

  prevMonth = () => {
    const month = new Date(this.state.month);

    month.setMonth(month.getMonth() - 1);

    this.setState({ month });
  };

  nextMonth = () => {
    const month = new Date(this.state.month);

    month.setMonth(month.getMonth() + 1);

    this.setState({ month });
  };

  prevYear = () => {
    const month = new Date(this.state.month);

    month.setMonth(month.getMonth() - 12);

    this.setState({ month });
  };

  nextYear = () => {
    const month = new Date(this.state.month);

    month.setMonth(month.getMonth() + 12);

    this.setState({ month });
  };

  render() {
    const { minDate, maxDate, disableRange } = this.props;

    const month = this.state.month;
    const isPrevEnabled = !minDate || month > minDate;
    const isNextEnabled = !maxDate || month < maxDate;

    return (
      <Month
        month={month.getMonth()}
        year={month.getFullYear()}
        onPress={this.handlePressDay}
        minDate={minDate}
        maxDate={maxDate}
        startDate={this.state.startDate}
        endDate={this.state.endDate}
        disableRange={disableRange}
        prevMonth={isPrevEnabled && this.prevMonth}
        nextMonth={isNextEnabled && this.nextMonth}
        prevYear={this.prevYear}
        nextYear={this.nextYear}
      />
    );
  }
}
