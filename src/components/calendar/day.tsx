import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { DayType } from './utils';

const styles = StyleSheet.create({
  activeDate: {},
  container: {
    alignItems: 'center',
    flex: 1,
    marginVertical: 5,
    paddingVertical: 10,
  },
  endDate: {
    borderBottomRightRadius: 60,
    borderTopRightRadius: 60,
  },
  startDate: {
    borderBottomLeftRadius: 60,
    borderTopLeftRadius: 60,
  },
});

interface Props {
  onPress: (date: Date) => void;
  item: DayType;
  theme: any;
}

export const Day = React.memo<Props>(
  (props: Props) => {
    const {
      item: { date, isVisible, isActive, isStartDate, isEndDate },
      theme,
    } = props;

    const Cmp: any = isVisible ? TouchableOpacity : View;

    let containerStyle = [
      styles.container,
      isActive ? theme.activeDayContainer : {},
      isStartDate ? styles.startDate : {},
      isEndDate ? styles.endDate : {},
    ];
    let textStyle = [theme.dayText, isActive ? theme.activeDayText : {}];

    if (!isVisible) {
      containerStyle = [
        styles.container,
        theme.dayContainer,
        isActive ? theme.activeDayContainer : {},
        isStartDate ? styles.startDate : {},
        isEndDate ? styles.endDate : {},
      ];
      textStyle = [theme.disabledText];
    }

    return (
      <Cmp style={containerStyle} onPress={() => props.onPress(props.item.date)}>
        <Text style={textStyle}>{date.getDate()}</Text>
      </Cmp>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.item.isActive === nextProps.item.isActive &&
      prevProps.item.isVisible === nextProps.item.isVisible &&
      prevProps.item.isStartDate === nextProps.item.isStartDate &&
      prevProps.item.isEndDate === nextProps.item.isEndDate &&
      prevProps.theme === nextProps.theme
    );
  },
);
