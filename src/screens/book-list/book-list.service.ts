import _ from 'lodash';
import { Q } from '@nozbe/watermelondb';
import { Where } from '@nozbe/watermelondb/QueryDescription';
import { BookFilters, BookSort, Interval } from 'types/book-filters';
import { sanitizeLike } from 'utils/sanitize';
import { inject, Session } from 'services';

const HALF_DAY = 12 * 60 * 60 * 1000;

const ON_FITLERS = {
  author: authorFilter,
};

const WHERE_FILTERS = {
  status: whereFilter('status'),
  year: yearFilter,
  type: whereFilter('type'),
  date: dateFilter,
  rating: ratingFilter,
  title: titleFitler,
  isLiveLib: isLiveLibFiltler,
  minYear: minYearFilter,
};

export function createQueryState(filters: Partial<BookFilters>, sort: BookSort) {
  return {
    query: [...buildQueries(ON_FITLERS, filters), Q.and(...buildQueries(WHERE_FILTERS, filters))] as Where[],
    sort,
    filters,
  };
}

function buildQueries(filters, values: Partial<BookFilters>): Where[] {
  const mapFilter = (fn, key) => (values[key] ? fn(values[key]) : null);

  return _.map(filters, mapFilter).filter(_.identity);
}

function whereFilter(field) {
  return value => Q.where(field, value);
}

function yearFilter(year: number) {
  if (year < 100) {
    year += 2000;
  }

  const dateFilter = Q.between(new Date(year, 0, 1, 0).getTime(), new Date(year, 11, 31, 23, 59, 59).getTime());

  return Q.where('date', dateFilter);
}

function authorFilter(author) {
  return Q.on('book_authors', 'author_id', author.id);
}

function dateFilter({ from, to }: Interval<Date>) {
  const dateFilter = Q.between(from.getTime() - HALF_DAY, to.getTime() + HALF_DAY);

  return Q.where('date', dateFilter);
}

function ratingFilter({ from, to }: Interval<number>) {
  return Q.where('rating', Q.between(from, to));
}

function titleFitler(title: string) {
  return Q.where('search', Q.like(`%${sanitizeLike(title.toLowerCase())}%`));
}

function isLiveLibFiltler() {
  return Q.where('id', Q.like('l_%'));
}

function minYearFilter() {
  const session = inject(Session);
  const min = new Date(session.minYear, 0, 1, 0, 0, 0).getTime();

  return Q.where('date', Q.gte(min));
}
