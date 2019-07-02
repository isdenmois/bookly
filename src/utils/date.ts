import format from 'date-fns/format';

const DATE_FORMAT = 'DD.MM.YYYY';

export function formatDate(date) {
  return format(date, DATE_FORMAT);
}
