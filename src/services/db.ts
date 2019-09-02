import { Database } from '@nozbe/watermelondb';
import { inject } from 'services/inject/inject';

export function dbAction(target, name, descriptor) {
  const method = descriptor.value;

  descriptor.value = function() {
    const database = this.database || this.db || inject(Database);
    const ctx = this;
    const args = arguments;

    return database.action(() => method.apply(ctx, args));
  };
}
