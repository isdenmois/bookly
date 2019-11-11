import _ from 'lodash';

const valuesKey = Symbol('key');

export function hasUpdates(cmp: any, newProps, newState, paths: Array<string>) {
  if (cmp.props === newProps) return true;
  const props = (cmp[valuesKey] = cmp[valuesKey] || {});
  let updates = false;
  let i: number;
  let length = paths.length;
  let path: string;
  let value: any;

  for (i = length; i-- !== 0; ) {
    path = paths[i];
    value = _.get(newProps, path);

    if (updates === false) {
      updates = props[path] !== value;
    }

    props[path] = value;
  }

  return updates || (cmp.state && hasStateUpdates(cmp.state, newState));
}

export function hasStateUpdates(state: any, newState) {
  if (state === newState) return true;

  const keys = Object.keys(state);
  const length = keys.length;
  let i: number, key: string;

  if (Object.keys(newState).length !== length) return false;

  for (i = length; i-- !== 0; ) {
    key = keys[i];

    if (state[key] !== newState[key]) {
      return false;
    }
  }

  return true;
}
