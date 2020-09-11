import { i18n } from 'services/i18n';

const DATE_FORMAT = 'DD.MM.YYYY';

const TOKEN = /YYYY|YY|MM|DD|HH|mm/g;

const flags = {
  YYYY: (d: Date) => d.getFullYear(),
  YY: (d: Date) => String(d.getFullYear()).slice(2),
  MM: (d: Date) => p(d.getMonth() + 1),
  DD: (d: Date) => p(d.getDate()),
  HH: (d: Date) => p(d.getHours()),
  mm: (d: Date) => p(d.getMinutes()),
};
export const ONE_DAY = 1000 * 60 * 60 * 24;

function toDate(date) {
  return date instanceof Date ? date : new Date(date);
}

export function format(date: any, mask: string): string {
  date = toDate(date);

  return mask.replace(TOKEN, $0 => flags[$0](date));
}

export function formatDate(date): string {
  return format(date, DATE_FORMAT);
}

function p(s: number) {
  return String(s).padStart(2, '0');
}

export function getCurrentYear() {
  return new Date().getFullYear();
}

export function getStartOfYear(date = new Date()) {
  return new Date(date.getFullYear(), 0, 1, 0);
}

export function dayOfYear(date = new Date()): number {
  const start = getStartOfYear(date);
  const diff = date.getTime() - start.getTime() + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;

  return Math.floor(diff / ONE_DAY) + 1;
}

export function daysAmount(year: number | Date = new Date()) {
  if (year instanceof Date) {
    year = year.getFullYear();
  }

  return isLeapYear(year) ? 366 : 365;
}

function isLeapYear(year: number) {
  return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
}

export function isSameDate(one: Date, other: Date) {
  return (
    one.getDate() === other.getDate() &&
    one.getMonth() === other.getMonth() &&
    one.getFullYear() === other.getFullYear()
  );
}

const MONTHS = {
  ru: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
};

const DAYS = {
  ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};

export function getMonthNames(): string[] {
  return MONTHS[i18n.getLocale()];
}

export function getDayNames() {
  return DAYS[i18n.getLocale()];
}

export function getNumberOfDaysInMonth(month: number, year: number) {
  switch (month) {
    case 0:
      return 31;
    case 1:
      return isLeapYear(year) ? 29 : 28;
    case 2:
      return 31;
    case 3:
      return 30;
    case 4:
      return 31;
    case 5:
      return 30;
    case 6:
      return 31;
    case 7:
      return 31;
    case 8:
      return 30;
    case 9:
      return 31;
    case 10:
      return 30;
    case 11:
      return 31;
    default:
      return 30;
  }
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);

  result.setDate(result.getDate() + days);

  return result;
}
