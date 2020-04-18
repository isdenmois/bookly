import { observable } from 'mobx';
import { synchronize } from '@nozbe/watermelondb/sync';
import { getLastPulledAt } from '@nozbe/watermelondb/sync/impl';
import { database } from 'store';
import { Session } from './session';
import { API } from './api';
import { Database } from '@nozbe/watermelondb';

export class SyncService {
  constructor(private database: Database, private session: Session, private api: API) {}

  @observable lastPulledAt: number = 0;

  async sync() {
    if (!this.session.userId) {
      return null;
    }

    await synchronize(this as any);

    this.lastPulledAt = await getLastPulledAt(database);
  }

  pullChanges = async ({ lastPulledAt }) => {
    const changes = await this.api.fetchChanges(lastPulledAt);

    return { changes, timestamp: Date.now() };
  };

  pushChanges = ({ lastPulledAt, changes }) => this.api.pushChanges(lastPulledAt, changes);
}
