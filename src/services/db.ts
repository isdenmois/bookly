import { database } from 'store';

export function dbAction(target, name, descriptor) {
  const method = descriptor.value;

  descriptor.value = function () {
    const ctx = this;
    const args = arguments;

    return database.write(() => method.apply(ctx, args));
  };
}
