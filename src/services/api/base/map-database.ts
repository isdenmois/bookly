import _ from 'lodash';
import { inject } from 'react-ioc';
import { Database, Q } from '@nozbe/watermelondb';
import { BehaviorSubject, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export function mapDatabase(context, collection, data) {
  if (!collection) {
    return data;
  }

  const database = context.database || inject(context, Database);
  const c = database.collections.get(collection);
  const query = Q.where('id', _.isArray(data) ? Q.oneOf(getIds(data)) : data.id);
  const fields = getFields(c);

  return c
    .query(query)
    .fetch()
    .then(records => mapRecords(data, records, fields));
}

function mapRecords(data, records, fields) {
  if (_.isArray(data)) {
    return _.map(data, row => mapRecord(row, records, fields));
  }

  return mapRecord(data, records, fields);
}

function mapRecord(row, records, fields) {
  const record = _.find(records, { id: row.id }) || new Observable(row);

  row = _.assign(row, _.pick(record, fields));
  row.record = record;

  return row;
}

function getFields(collection) {
  return _.map(collection.schema.columns, c => c.name);
}

function getIds(data) {
  if (_.isArray(data)) {
    return data.map(row => row.id);
  }

  return [data.id];
}

function Observable(row) {
  this.subject = new BehaviorSubject(row);
  this.observe = function() {
    return this.subject.pipe(switchMap((r: any) => (r.collection ? r.observe() : of(r))));
  };
  this.next = function(data) {
    this.subject.next(data);
  };
}
