import _ from 'lodash';
import { useState, useEffect } from 'react';

export function createState<T>(initialState: T) {
  const watchers = {};
  let all = [];
  const obj = Object.assign({}, initialState, { set, multiSet, watchAll, getState });

  function watch(field, callback) {
    watchers[field] = watchers[field] || [];
    watchers[field].push(callback);

    return () => {
      watchers[field] = watchers[field].filter(c => c !== callback);
    };
  }

  function watchAll(callback) {
    all.push(callback);

    return () => {
      all = all.filter(c => c !== callback);
    };
  }

  function set(field, value) {
    obj[field] = value;
    watchers[field]?.forEach(c => c(value));
    all.forEach(c => c(field, value));
  }

  function getState(): T {
    return _.omit(obj, ['set', 'multiSet', 'watchAll', 'getState']) as any;
  }

  function multiSet(value) {
    Object.assign(obj, value);

    for (let field in value) {
      watchers[field]?.forEach(c => c(value[field]));
    }
  }

  function useValue(field) {
    const [value, setValue] = useState(obj[field]);

    useEffect(() => {
      return watch(field, setValue);
    }, [field]);

    return value;
  }

  return <const>[obj, useValue];
}
