import { isSameDate, addDays, getNumberOfDaysInMonth } from 'utils/date';

export interface DayType {
  id: string;
  date: Date;
  isActive: boolean;
  isStartDate: boolean;
  isEndDate: boolean;
  isVisible: boolean;
}

const MONDAY_FIRST = [6, 0, 1, 2, 3, 4, 5];

export function getMonthDays(
  month: number,
  year: number,
  disableRange: boolean,
  startDate?: Date,
  endDate?: Date,
  minDate?: Date,
  maxDate?: Date,
): DayType[] {
  if (minDate instanceof Date) minDate.setHours(0, 0, 0, 0);
  if (maxDate instanceof Date) maxDate.setHours(0, 0, 0, 0);
  if (startDate instanceof Date) startDate.setHours(0, 0, 0, 0);
  if (endDate instanceof Date) endDate.setHours(0, 0, 0, 0);

  const firstMonthDay = new Date(year, month, 1);

  const daysToAdd = getNumberOfDaysInMonth(month, year);
  const days: DayType[] = [];

  const startWeekOffset = MONDAY_FIRST[firstMonthDay.getDay()];
  const daysToCompleteRows = (startWeekOffset + daysToAdd) % 7;
  const lastRowNextMonthDays = daysToCompleteRows ? 7 - daysToCompleteRows : 0;

  for (let i = -startWeekOffset; i < daysToAdd + lastRowNextMonthDays; i++) {
    const date: Date = addDays(firstMonthDay, i);
    const day = date.getDate();
    const month = date.getMonth();
    const fullDay = day < 10 ? `0${day}` : day.toString();
    const fullMonth = month < 10 ? `0${month + 1}` : (month + 1).toString();
    const id = `${date.getFullYear()}-${fullMonth}-${fullDay}`;

    let isOnSelectableRange = !minDate && !maxDate;

    isOnSelectableRange = (!minDate || (minDate && date >= minDate)) && (!maxDate || (maxDate && date <= maxDate));

    const isMonthDate = i >= 0 && i < daysToAdd;
    let isStartDate = false;
    let isEndDate = false;
    let isActive = false;

    if (endDate && startDate && !disableRange) {
      isStartDate = isSameDate(date, startDate);
      isEndDate = isSameDate(date, endDate);

      isActive = date >= startDate && date <= endDate;
    } else if (startDate && isSameDate(date, startDate)) {
      isStartDate = true;
      isEndDate = true;
      isActive = true;
    }

    days.push({
      id: `${month}-${id}`,
      date,
      isActive,
      isStartDate,
      isEndDate,
      isVisible: isOnSelectableRange && isMonthDate,
    });
  }

  return days;
}
