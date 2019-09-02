import _ from 'lodash';

export function parseResult(schema, response) {
  return Promise.resolve(response)
    .then(data => (Array.isArray(data) && schema.filter ? data.filter(schema.filter) : data))
    .then(data => (schema.mapBody ? mapResult(schema.mapBody, data) : data));
}

function mapResult(map, data) {
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
