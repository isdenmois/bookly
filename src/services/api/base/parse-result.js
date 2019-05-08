import _ from 'lodash';
import { mapDatabase } from './map-database';

export function parseResult(context, schema) {
  return function(response) {
    return response
      .json()
      .then(data => (schema.mapBody ? mapResult(schema.mapBody, data) : data))
      .then(data => mapDatabase(context, schema.collection, data));
  };
}

function mapResult(map, data) {
  if (_.isArray(data)) {
    return _.map(data, obj => mapObject(map, obj));
  }

  return mapObject(map, data);
}

function mapObject(map, data) {
  const result = {};

  _.forEach(map, (path, key) => {
    result[key] = _.isFunction(path) ? path(data) : _.get(data, path);
  });

  if (result.id) {
    result.id = result.id.toString();
  }

  return result;
}
