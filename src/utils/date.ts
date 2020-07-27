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

export function format(date: any, mask: string): string {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

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
