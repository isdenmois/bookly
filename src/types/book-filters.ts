import type Author from 'store/author';
import type List from 'store/list';
import type { BOOK_STATUSES } from 'types/book-statuses.enum';

export interface BookSort {
  field: string;
  desc: boolean;
}

export interface Interval<T> {
  from: T;
  to: T;
}

export interface BookFilters {
  status: BOOK_STATUSES;
  title: string;
  year: number;
  author: Pick<Author, 'name' | 'id'>;
  type: string;
  date: Interval<Date>;
  rating: Interval<number>;
  isLiveLib: boolean;
  paper: string;
  list: List;
  reads: string[];
  audio: 'y' | 'n';
}
