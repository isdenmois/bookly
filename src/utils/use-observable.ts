import { useEffect, useState, useDebugValue } from 'react';
import { Observable } from 'rxjs/internal/Observable';

export function useObservable<TState, TInputs extends Readonly<any[]>>(
  init: (inputs$: TInputs) => Observable<TState>,
  initialState: TState,
  inputs: TInputs,
): TState {
  const [state, setState] = useState<TState>(initialState);

  useEffect(() => {
    const subscription = init(inputs).subscribe(setState);

    return () => {
      subscription.unsubscribe();
    };
  }, inputs);

  useDebugValue(state);

  return state;
}

export function usePromise<TState, TInputs extends Readonly<any[]>>(
  init: (inputs$: TInputs) => Promise<TState>,
  initialState: TState,
  inputs: TInputs,
): TState {
  const [state, setState] = useState<TState>(initialState);

  useEffect(() => {
    init(inputs).then(setState);
  }, inputs);

  useDebugValue(state);

  return state;
}
