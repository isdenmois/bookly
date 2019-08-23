import _ from 'lodash';
import { observable, action } from 'mobx';
import { BookFilters as IBookFilters, Interval, BookSort } from 'types/book-filters';
import { BOOK_STATUSES } from 'types/book-statuses.enum';

export class BookFilters {
  @observable title: string = null;
  @observable year: number = null;
  @observable author: string = null;
  @observable type: any = null;
  @observable.ref date: Interval<Date> = null;
  @observable.ref rating: Interval<number> = null;
  @observable.ref sort: BookSort = null;
  @observable changed: boolean = false;
  status: BOOK_STATUSES = null;

  @action setInitial(filters: Partial<IBookFilters>, sort: BookSort) {
    Object.assign(this, filters);
    this.sort = sort;
  }

  @action setFilter(filter: keyof IBookFilters, value: any) {
    this[filter] = value;
    this.changed = true;
  }

  @action setSort(sort: BookSort) {
    this.sort = sort;
    this.changed = true;
  }

  getFilters(fields: Array<keyof IBookFilters>): Partial<IBookFilters> {
    const filters: Partial<IBookFilters> = _.pick(this, fields.concat('status'));

    if (filters.title) {
      filters.title = filters.title.trim();
    }

    return _.omitBy(filters, isEmpty);
  }
}

function isEmpty(value) {
  return value === null || value === '';
}
