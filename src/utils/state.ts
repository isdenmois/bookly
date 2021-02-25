import _ from 'lodash';
import { useState, useEffect } from 'react';

export type State<T> = T & {
  getState(): T;
  set<K extends keyof T>(field: K, value: T[K]): void;
  multiSet(value: Partial<T>): void;
  watchAll(callback: WatchAllCallback<T>): void;
};

type WatchAllCallback<T> = (field?: keyof T, value?: T[typeof field]) => void;
export type UseValue<T, K extends keyof T> = (field: K, defaultValue?: T[K]) => T[K];

export function createState<T>(initialState: T): [State<T>, UseValue<T, any>] {
  const watchers: Record<keyof T, Function[]> = {} as any;
  let all = [];
  const obj: State<T> = Object.assign({}, initialState, { set, multiSet, watchAll, getState });

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

  function set(field: keyof T, value: any) {
    obj[field] = value;
    watchers[field]?.forEach(c => c(value));
    all.forEach(c => c(field, value));
  }

  function getState(): T {
    return _.omit(obj, ['set', 'multiSet', 'watchAll', 'getState']) as any;
  }

  function multiSet(value: Partial<T>) {
    Object.assign(obj, value);

    for (let field in value) {
      watchers[field]?.forEach(c => c(value[field]));
    }
  }

  function useValue(field, defaultValue) {
    const [value, setValue] = useState(obj[field] ?? defaultValue);

    useEffect(() => {
      return watch(field, setValue);
    }, [field]);

    return value;
  }

  return [obj, useValue];
}
