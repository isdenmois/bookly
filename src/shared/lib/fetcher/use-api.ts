import { useEffect, useReducer, useRef, useState } from 'react';

const reducer = (state, action) => {
  switch (action.type) {
    case 'loading':
      return { status: 'loading', data: null };
    case 'error':
      return { status: 'error', data: action.error };
    case 'success':
      return { status: 'success', data: action.value };
  }

  return state;
};

const initialState = { status: 'loading', data: null };

export function useApi<T = {}, P = {}>(api: (props: P) => Promise<T>, params: P, deps: any[]): ApiResult<T> {
  const [{ status, data }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: 'loading' });

    api(params).then(
      value => dispatch({ type: 'success', value }),
      e => dispatch({ type: 'error', error: e?.message || e?.toString() }),
    );
  }, deps);

  return {
    loading: status === 'loading',
    error: status === 'error' ? data : null,
    data: status === 'success' ? data : null,
  };
}

const $error = Symbol('error');
const suspenseCache = new WeakMap();
const getKey = params => JSON.stringify(params);
const getFromCache = (api, params) => {
  const cached = suspenseCache.get(api) || {};

  return cached[getKey(params)];
};
const setCache = (api, params, value) => {
  if (!suspenseCache.has(api)) {
    suspenseCache.set(api, {});
  }

  suspenseCache.get(api)[getKey(params)] = value;
};
const getInitialState = cached => {
  if (cached === $error) {
    return { status: 'error', data: "Can't fetch api" };
  }
  if (cached) {
    return { status: 'success', data: cached };
  }

  return initialState;
};

export function useSuspendApi<T = {}, P = {}>(api: (props: P) => Promise<T>, params: P, deps: any[]): T {
  const cached = getFromCache(api, params);
  const [{ status, data }, dispatch] = useReducer(reducer, getInitialState(initialState));
  const { promise, resolve } = createDeffered();

  useEffect(() => {
    dispatch({ type: 'loading' });

    api(params)
      .then(
        value => {
          dispatch({ type: 'success', value });
          setCache(api, params, value);
          return value;
        },
        e => {
          dispatch({ type: 'error', error: e?.message || e?.toString() });
          setCache(api, params, $error);
          return $error;
        },
      )
      .then(resolve);
  }, deps);

  if (!cached && status === 'loading') {
    throw promise;
  }

  if (status === 'error') {
    throw data;
  }

  return data;
}

const createDeffered = () => {
  let resolve: any;
  const promise = new Promise(r => (resolve = r));

  return { promise, resolve };
};

interface ApiResult<T> {
  loading: boolean;
  data?: T;
  error: string;
}
