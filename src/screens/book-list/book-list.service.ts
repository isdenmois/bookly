import _ from 'lodash';
import { Q } from '@nozbe/watermelondb';

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

function dateFilter({ from, to }) {
  const dateFilter = Q.between(from.getTime() - HALF_DAY, to.getTime() + HALF_DAY);

  return Q.where('date', dateFilter);
}

function ratingFilter({ from, to }) {
  return Q.where('rating', Q.between(from, to));
}
