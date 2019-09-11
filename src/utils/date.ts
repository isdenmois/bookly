// import format from 'date-fns/format';

const DATE_FORMAT = 'DD.MM.YYYY';

const TOKEN = /MM|DD|YYYY/g;

const flags = {
  YYYY: (d: Date) => d.getFullYear(),
  YY: (d: Date) => String(d.getFullYear()).slice(2),
  MM: (d: Date) => p(d.getMonth() + 1),
  DD: (d: Date) => p(d.getDate()),
  HH: (d: Date) => p(d.getHours()),
  mm: (d: Date) => p(d.getMinutes()),
};

export function format(date: any, mask: string) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  return mask.replace(TOKEN, $0 => flags[$0](date));
}

export function formatDate(date) {
  return format(date, DATE_FORMAT);
}

function p(s: number) {
  return String(s).padStart(2, '0');
}
