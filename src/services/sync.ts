import { observable } from 'mobx';
import { synchronize } from '@nozbe/watermelondb/sync';
import { getLastPulledAt } from '@nozbe/watermelondb/sync/impl';
import { Database } from '@nozbe/watermelondb';
import { inject } from './inject/inject';
import { Session } from './session';
import { API } from './api';

export class SyncService {
  database = inject(Database);
  session = inject(Session);
  api = inject(API);

  @observable lastPulledAt: number = 0;

  async sync() {
    if (!this.session.userId) {
      return null;
    }

    await synchronize(this as any);

    this.lastPulledAt = await getLastPulledAt(this.database);
  }

  pullChanges = async ({ lastPulledAt }) => {
    const changes = await this.api.fetchChanges(lastPulledAt);

    return { changes, timestamp: Date.now() };
  };

  pushChanges = ({ lastPulledAt, changes }) => this.api.pushChanges(lastPulledAt, changes);
}
