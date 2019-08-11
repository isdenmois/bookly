import _ from 'lodash';
import { Database, Q } from '@nozbe/watermelondb';
import { Observable } from 'utils/model-observable';
import { inject } from 'services/inject/inject';

export function mapDatabase(collection, data) {
  if (!collection) {
    return data;
  }

  const database = inject(Database);
  const c = database.collections.get(collection);
  const query = Q.where('id', _.isArray(data) ? Q.oneOf(getIds(data)) : data.id);
  const fields = getFields(c);

  return c
    .query(query)
    .fetch()
    .then(records => mapRecords(collection, data, records, fields));
}

function mapRecords(collection, data, records, fields) {
  if (_.isArray(data)) {
    return _.map(data, row => mapRecord(collection, row, records, fields));
  }

  return mapRecord(collection, data, records, fields);
}

function mapRecord(collection, row, records, fields) {
  const record = _.find(records, { id: row.id }) || new Observable(collection, row.id, row);

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
