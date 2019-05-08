import { inject } from 'react-ioc';
import { Database } from '@nozbe/watermelondb';
import { SyncService } from './sync';

export function dbAction(target, name, descriptor) {
  const method = descriptor.value;

  descriptor.value = function() {
    const database = this.database || this.db || inject(this, Database);
    const syncService = inject(this, SyncService);
    const ctx = this;
    const args = arguments;

    return database.action(() => method.apply(ctx, args)).then(() => syncService.sync());
  };
}

export function dbSync(target, name, descriptor) {
  const method = descriptor.value;

  descriptor.value = function() {
    const syncService = inject(this, SyncService);
    const ctx = this;
    const args = arguments;

    return Promise.resolve(method.apply(ctx, args)).then(() => syncService.sync());
  };
}
