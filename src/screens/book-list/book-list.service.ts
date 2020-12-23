import _ from 'lodash';
import { Q } from '@nozbe/watermelondb';
import { Where } from '@nozbe/watermelondb/QueryDescription';
import { BookFilters, BookSort, Interval } from 'types/book-filters';
import { sanitizeLike } from 'utils/sanitize';
import { settings } from 'services';

const HALF_DAY = 12 * 60 * 60 * 1000;

const ON_FITLERS = {
  author(author) {
    return Q.on('book_authors', 'author_id', author.id);
  },
  list(list) {
    return Q.on('list_books', 'list_id', list.id);
  },
};

const WHERE_FILTERS = {
  type: whereFilter('type'),
  status: whereFilter('status'),
  year(year: number) {
    if (year < 100) {
      year += 2000;
    }

    const dateFilter = Q.between(new Date(year, 0, 1, 0).getTime(), new Date(year, 11, 31, 23, 59, 59).getTime());

    return Q.where('date', dateFilter);
  },
  date({ from, to }: Interval<Date>) {
    from = from instanceof Date ? from : new Date(from);
    to = to instanceof Date ? to : new Date(to);
    const dateFilter = Q.between(from.getTime() - HALF_DAY, to.getTime() + HALF_DAY);

    return Q.where('date', dateFilter);
  },
  rating({ from, to }: Interval<number>) {
    return Q.where('rating', Q.between(from, to));
  },
  title(title: string) {
    return Q.where('search', Q.like(`%${sanitizeLike(title.toLowerCase())}%`));
  },
  isLiveLib() {
    return Q.where('id', Q.like('l_%'));
  },
  minYear() {
    const min = new Date(settings.minYear, 0, 1, 0, 0, 0).getTime();

    return Q.where('date', Q.gte(min));
  },
  paper(value) {
    return Q.where('paper', value === 'y' ? true : Q.notEq(true));
  },
  audio(value) {
    return Q.where('audio', value === 'y' ? true : Q.notEq(true));
  },
  withoutTranslation(value) {
    return Q.where('without_translation', value === 'y' ? true : Q.notEq(true));
  },
  leave(value) {
    return Q.where('leave', value === 'y' ? true : Q.notEq(true));
  },
};

export function createQueryState(filters: Partial<BookFilters>, sort: BookSort) {
  const and = buildQueries(WHERE_FILTERS, filters);
  let query = [...buildQueries(ON_FITLERS, filters), and.length > 1 ? Q.and(...and) : and[0]] as Where[];

  if (filters.reads?.length) {
    query = query.map(where => (where.type === 'and' ? Q.or(Q.where('id', Q.oneOf(filters.reads)), where) : where));
  }

  return {
    query,
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
