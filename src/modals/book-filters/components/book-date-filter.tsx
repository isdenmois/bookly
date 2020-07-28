import React from 'react';
import { StyleSheet, ViewStyle, View } from 'react-native';
import { Calendar, DateObject } from 'react-native-calendars';
import { ColorSchemeContext } from 'react-native-dynamic';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { observer } from 'mobx-react';
import { dynamicColor, getColor } from 'types/colors';
import { formatDate } from 'utils/date';
import { TouchIcon } from 'components';
import { OpenableListItem } from './openable-list-item';
import { BookFilters } from '../book-filters.service';

interface Props {
  filters: BookFilters;
  onApply: () => void;
}

interface State {
  opened: boolean;
  from: Date;
  markedDates: any;
}

const HALF_DAY = 12 * 60 * 60 * 1000;

export function formatPeriod(period) {
  const value: any = period || {};
  const { from, to } = value;

  return from && to ? `${formatDate(from)} - ${formatDate(to)}` : '';
}

@observer
export class BookDateFilter extends React.PureComponent<Props, State> {
  static contextType = ColorSchemeContext;
  state: State = { opened: false, from: null, markedDates: null };

  today = new Date();
  calendar: any;

  render() {
    const date = formatPeriod(this.props.filters.date);
    const color = getColor(this.context);

    return (
      <OpenableListItem title='modal.date' viewValue={date} onClear={this.clear} onClose={this.resetState}>
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
            theme={{
              calendarBackground: 'transparent',
              todayTextColor: color.Primary,
              monthTextColor: color.PrimaryText,
              dayTextColor: color.PrimaryText,
              textDisabledColor: color.DisabledText,
            }}
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

  renderArrow = (direction: string) => {
    return <Icon name={`caret-${direction}`} size={20} color={dynamicColor.PrimaryText[this.context]} />;
  };

  setCalRef = calendar => (this.calendar = calendar);

  addYear = () => this.calendar.addMonth(12);
  subYear = () => this.calendar.addMonth(-12);

  onDayPress = ({ dateString, timestamp }: DateObject) => {
    const date = new Date(timestamp + HALF_DAY);

    if (this.state.markedDates) {
      this.setDate(date);
    } else {
      const mode = this.context;
      this.setState({
        from: date,
        markedDates: {
          [dateString]: {
            startingDay: true,
            color: dynamicColor.Primary[mode],
            textColor: dynamicColor.PrimaryText[mode],
          },
        },
      });
    }
  };

  setDate = (to: Date) => {
    const from = this.state.from;

    this.props.filters.setFilter('date', { from, to });
    this.props.filters.setFilter('year', null);
  };

  clear = () => this.props.filters.setFilter('date', null);
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
