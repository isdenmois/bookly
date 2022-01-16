import { atom, onMount, ReadableAtom } from 'nanostores';
import type { Observable } from 'rxjs';

export const fromRx = <T>(observable: () => Observable<T>, initialValue?: T): ReadableAtom<T> => {
  const store = atom<T>(initialValue);

  onMount(store, () => {
    const s = observable().subscribe(value => {
      store.set(value);
    });
    return () => {
      s.unsubscribe();
    };
  });

  return store;
};
