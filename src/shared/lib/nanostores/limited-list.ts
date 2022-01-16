import { map, mapTemplate, MapTemplate, onMount, ReadableAtom } from 'nanostores';
import { Observable } from 'rxjs';

export interface LimitedList<T> {
  id: string;
  items: T[];
  totalCount: number;
}

export const createLimitedList = <T>(
  limitedQuery: () => Observable<T[]>,
  totalCountQuery: () => Observable<number>,
): ReadableAtom<LimitedList<T>> => {
  const store = map<LimitedList<T>>({ id: null, items: [], totalCount: 0 });

  onMount(store, () => {
    const itemssSubscription = limitedQuery().subscribe(items => {
      store.setKey('items', items);
    });
    const totalCountSubscription = totalCountQuery().subscribe(totalCount => {
      store.setKey('totalCount', totalCount);
    });

    return () => {
      itemssSubscription.unsubscribe();
      totalCountSubscription.unsubscribe();
    };
  });

  return store;
};

export const createLimitedListTemplate = <T>(
  limitedQuery: (id: string) => Observable<T[]>,
  totalCountQuery: (id: string) => Observable<number>,
): MapTemplate<LimitedList<T>> => {
  return mapTemplate<LimitedList<T>>((store, id) => {
    store.set({ id, items: [], totalCount: 0 });

    const itemsSubscription = limitedQuery(id).subscribe(items => {
      store.setKey('items', items);
    });
    const totalCountSubscription = totalCountQuery(id).subscribe(totalCount => {
      store.setKey('totalCount', totalCount);
    });

    return () => {
      itemsSubscription.unsubscribe();
      totalCountSubscription.unsubscribe();
    };
  });
};
