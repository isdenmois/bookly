import { format } from 'utils/date';

const DATE_FORMAT = 'DD.MM';
export const formatDate = date => format(date, DATE_FORMAT);
