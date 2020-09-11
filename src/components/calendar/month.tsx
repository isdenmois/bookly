import React, { memo } from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { getMonthNames, getDayNames } from 'utils/date';
import { TouchIcon } from 'components/touch-icon';
import { DynamicStyleSheet } from 'react-native-dynamic';
import { useSColor, dynamicColor } from 'types/colors';
import { getMonthDays, DayType } from './utils';
import { Day } from './day';

interface Props {
  month: number;
  year: number;
  startDate?: Date;
  endDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  disableRange?: boolean;
  onPress: (date: Date) => void;
  prevMonth: () => void;
  nextMonth: () => void;
  prevYear: () => void;
  nextYear: () => void;
}

export default memo<Props>((props: Props) => {
  const { month, year, minDate, maxDate } = props;
  const { prevYear, nextYear, prevMonth, nextMonth } = props;
  const { color, s } = useSColor(ds);
  const leftColor = prevMonth ? color.PrimaryText : color.DisabledText;
  const rightColor = nextMonth ? color.PrimaryText : color.DisabledText;

  const MONTH_NAMES = getMonthNames();
  const DAY_NAMES = getDayNames();
  const monthName = `${MONTH_NAMES[month]} ${year}`;

  const days = getMonthDays(month, year, props.disableRange, props.startDate, props.endDate, minDate, maxDate);

  const weeks = [];

  while (days.length) {
    weeks.push(days.splice(0, 7));
  }

  return (
    <View>
      <View style={s.title}>
        <TouchIcon
          paddingVertical={16}
          name='chevron-left'
          size={20}
          color={leftColor}
          onPress={prevMonth}
          onLongPress={prevYear}
        />
        <Text style={s.titleText}>{monthName}</Text>
        <TouchIcon
          paddingVertical={16}
          name='chevron-right'
          size={20}
          color={rightColor}
          onPress={nextMonth}
          onLongPress={nextYear}
        />
      </View>

      <WeekDays days={DAY_NAMES} s={s} />

      {weeks.map((week: DayType[], index: number) => (
        <View key={String(index)} style={s.title}>
          {week.map((day: DayType) => (
            <Day key={day.id} item={day} onPress={props.onPress} theme={s} />
          ))}
        </View>
      ))}
    </View>
  );
});

const WeekDays = memo<any>(({ s, days }) => (
  <View style={s.title}>
    {days.map(day => (
      <View key={day} style={s.weekColumn}>
        <Text style={s.weekColumnText}>{day}</Text>
      </View>
    ))}
  </View>
));

const ds = new DynamicStyleSheet({
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  titleText: {
    textAlign: 'center',
    flex: 1,
    color: dynamicColor.PrimaryText,
  } as TextStyle,
  disabledText: {
    color: dynamicColor.DisabledText,
  } as ViewStyle,
  dayText: {
    color: dynamicColor.PrimaryText,
  } as ViewStyle,
  activeDayContainer: {
    backgroundColor: dynamicColor.Primary,
  } as ViewStyle,
  activeDayText: {
    color: dynamicColor.PrimaryTextInverse,
  } as TextStyle,
  weekColumnText: {
    color: dynamicColor.SecondaryText,
  } as TextStyle,
  weekColumn: {
    flex: 1,
    alignItems: 'center',
  } as ViewStyle,
});
