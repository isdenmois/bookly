import { atom, onMount, ReadableAtom } from 'nanostores';
import { State } from 'utils/state';

export function fromState<T, K extends keyof T>(state: State<T>, field: K): ReadableAtom<T[K]> {
  const store = atom<T[K]>(state[field]);

  store.set(state.getState()[field]);

  onMount(store, () => {
    store.set(state.getState()[field]);

    state.watch(field, value => {
      store.set(value);
    });
  });

  return store;
}
