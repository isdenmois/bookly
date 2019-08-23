import React from 'react';
import { StyleSheet, ViewStyle, View } from 'react-native';
import { Calendar, DateObject } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { observer } from 'mobx-react';
import { color } from 'types/colors';
import { formatDate } from 'utils/date';
import { inject } from 'services';
import { TouchIcon } from 'components';
import { OpenableListItem } from './openable-list-item';
import { BookFilters } from '../book-filters.service';

interface Props {
  onApply: () => void;
}

interface State {
  opened: boolean;
  from: Date;
  markedDates: any;
}

const HALF_DAY = 12 * 60 * 60 * 1000;
const MARKED_DAY = { startingDay: true, color: color.Primary };

@observer
export class BookDateFilter extends React.PureComponent<Props, State> {
  state: State = { opened: false, from: null, markedDates: null };

  filters = inject(BookFilters);

  today = new Date();
  calendar: any;

  get formattedDate(): string {
    const value: any = this.filters.date || {};
    const { from, to } = value;

    return from && to ? `${formatDate(from)} - ${formatDate(to)}` : '';
  }

  render() {
    return (
      <OpenableListItem title='Дата' viewValue={this.formattedDate} onClear={this.clear} onClose={this.resetState}>
        <View style={s.calendarRow}>
          <TouchIcon
            paddingVertical={16}
            paddingLeft={10}
            name='chevron-left'
            size={20}
            color={color.PrimaryText}
            onPress={this.subYear}
          />
          <Calendar
            style={s.calendar}
            minDate={this.state.from}
            maxDate={this.today}
            markedDates={this.state.markedDates}
            onDayPress={this.onDayPress}
            markingType='period'
            firstDay={1}
            hideDayNames
            renderArrow={this.renderArrow}
            ref={this.setCalRef}
          />
          <TouchIcon
            paddingVertical={16}
            paddingLeft={10}
            name='chevron-right'
            size={20}
            color={color.PrimaryText}
            onPress={this.addYear}
          />
        </View>
      </OpenableListItem>
    );
  }

  renderArrow(direction: string) {
    return <Icon name={`caret-${direction}`} size={20} color={color.PrimaryText} />;
  }

  setCalRef = calendar => (this.calendar = calendar);

  addYear = () => this.calendar.addMonth(12);
  subYear = () => this.calendar.addMonth(-12);

  onDayPress = ({ dateString, timestamp }: DateObject) => {
    const date = new Date(timestamp + HALF_DAY);

    if (this.state.markedDates) {
      this.setDate(date);
    } else {
      this.setState({ from: date, markedDates: { [dateString]: MARKED_DAY } });
    }
  };

  setDate = (to: Date) => {
    const from = this.state.from;

    this.filters.setFilter('date', { from, to });
    this.filters.setFilter('year', null);
  };

  clear = () => this.filters.setFilter('date', null);
  resetState = () => this.setState({ from: null, markedDates: null });
}

const s = StyleSheet.create({
  calendarRow: {
    flexDirection: 'row',
    flex: 1,
    height: 340,
  } as ViewStyle,
  calendar: {
    flex: 1,
  } as ViewStyle,
});
