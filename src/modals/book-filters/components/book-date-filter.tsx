import React from 'react';
import format from 'date-fns/format';
import { Text, StyleSheet, ViewStyle, TextStyle, View, TouchableOpacity } from 'react-native';
import { Calendar, DateObject } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { ListItem } from 'components/list-item';
import { TouchIcon } from 'components/touch-icon';

interface Props {
  value: string;
  onApply: () => void;
  onChange: (type: string, value: any) => void;
}

const DATE_FORMAT = 'DD.MM.YYYY';
const HALF_DAY = 12 * 60 * 60 * 1000;
const MARKED_DAY = { startingDay: true, color: '#009688' };

export class BookDateFilter extends React.PureComponent<Props> {
  state = { opened: false, from: null, markedDates: null };

  today = new Date();
  calendar: any;

  render() {
    const value: any = this.props.value || {};
    const { from, to } = value;
    const defined = Boolean(from && to);
    const opened = this.state.opened;

    return (
      <ListItem rowStyle={s.list} onPress={opened ? null : this.openCalendar}>
        {!opened && <Text style={s.title}>Дата</Text>}
        {opened && (
          <View style={s.container}>
            <TouchableOpacity onPress={this.closeCalendar}>
              <Text style={s.title}>Дата</Text>
            </TouchableOpacity>

            <View style={s.calendarRow}>
              <TouchIcon
                paddingVertical={16}
                paddingLeft={10}
                name='chevron-left'
                size={20}
                color='#000'
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
                color='#000'
                onPress={this.addYear}
              />
            </View>
          </View>
        )}
        {defined && !opened && (
          <Text style={s.value}>
            {format(from, DATE_FORMAT)} - {format(to, DATE_FORMAT)}
          </Text>
        )}

        {defined && !opened && (
          <TouchIcon paddingVertical={15} paddingLeft={10} name='times' size={20} color='#000' onPress={this.clear} />
        )}
      </ListItem>
    );
  }

  renderArrow(direction) {
    return <Icon name={`caret-${direction}`} size={20} color='#000' />;
  }

  setCalRef = calendar => {
    this.calendar = calendar;
  };

  openCalendar = () => this.setState({ opened: true });
  closeCalendar = () => this.setState({ opened: false, from: null, markedDates: null });

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

    this.props.onChange('date', { from, to });
    this.props.onChange('year', null);
    this.closeCalendar();
  };

  clear = () => this.props.onChange('date', null);
}

const s = StyleSheet.create({
  list: {
    paddingVertical: 0,
  } as ViewStyle,
  title: {
    fontSize: 16,
    color: 'black',
    paddingVertical: 15,
  } as TextStyle,
  container: {
    flex: 1,
  },
  calendarRow: {
    flexDirection: 'row',
    flex: 1,
    height: 340,
  } as ViewStyle,
  calendar: {
    flex: 1,
  } as ViewStyle,
  value: {
    fontSize: 16,
    color: 'black',
  } as TextStyle,
});
