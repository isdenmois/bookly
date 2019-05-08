import _ from 'lodash';
import { Q } from '@nozbe/watermelondb';

const ON_FITLERS = {
  author: authorFilter,
};

const WHERE_FILTERS = {
  status: whereFilter('status'),
  year: yearFilter,
  type: whereFilter('type'),
};

export function createQueryState(filters, sort) {
  return {
    query: [...buildQueries(ON_FITLERS, filters), Q.and(...buildQueries(WHERE_FILTERS, filters))],
    sort,
    filters,
  };
}

function buildQueries(filters, values) {
  const mapFilter = (fn, key) => (values[key] ? fn(values[key]) : null);

  return _.map(filters, mapFilter).filter(_.identity);
}

function whereFilter(field) {
  return value => Q.where(field, value);
}

function yearFilter(year) {
  const dateFilter = Q.between(new Date(year, 0, 1, 0).getTime(), new Date(year, 11, 31, 23, 59, 59).getTime());

  return Q.where('date', dateFilter);
}

function authorFilter(id) {
  return Q.on('book_authors', 'author_id', id);
}
