import { database } from 'store';

export function dbAction(target, name, descriptor) {
  const method = descriptor.value;

  descriptor.value = function () {
    const ctx = this;
    const args = arguments;

    return database.action(() => method.apply(ctx, args));
  };
}
