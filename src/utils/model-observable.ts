import { BehaviorSubject, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const cache = new Map<string, any>();

export function Observable(collection, id, row) {
  const key = `${collection}-${id}`;

  if (cache.has(key)) {
    this.subject = cache.get(key);
    this.subject.next(row);
  } else {
    this.subject = new BehaviorSubject(row);
    cache.set(key, this.subject);
  }

  this.observe = function () {
    return this.subject.pipe(switchMap((r: any) => (r.collection ? r.observe() : of(r))));
  };
  this.next = function (data) {
    cache.delete(key);
    this.subject.next(data);
  };
}
