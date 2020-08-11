import _ from 'lodash';
import { Schema } from './api';

export function parseResult(schema: Schema, response) {
  return Promise.resolve(response)
    .then(data => (schema.filterBefore ? filter(data, schema.filterBefore) : data))
    .then(data => (schema.response ? mapResult(schema.response, data) : data))
    .then(data => (schema.filter ? filter(data, schema.filter) : data));
}

function filter(data, fn) {
  if (Array.isArray(data)) {
    return _.filter(data, fn);
  }

  if (data && Array.isArray(data.items)) {
    data.items = _.filter(data.items, fn);
  }

  return data;
}

function mapResult(map, data) {
  if (typeof map === 'function') {
    return map(data);
  }

  if (_.isArray(data)) {
    return _.map(data, obj => mapObject(map, obj));
  }

  return mapObject(map, data);
}

function mapObject(map, data) {
  const result: any = {};

  _.forEach(map, (path, key) => {
    result[key] = _.isFunction(path) ? path(data) : _.get(data, path);
  });

  if (result.id) {
    result.id = result.id.toString();
  }

  return result;
}
