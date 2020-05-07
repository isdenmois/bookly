import { observable } from 'mobx';
import { synchronize } from '@nozbe/watermelondb/sync';
import { getLastPulledAt } from '@nozbe/watermelondb/sync/impl';
import { database } from 'store';
import { Session } from './session';
import { API } from './api';
import { loadSettings } from './settings-sync';

export class SyncService {
  database = database;
  session: Session;
  api: API;

  constructor(session: Session, api: API) {
    this.session = session;
    this.api = api;
  }

  @observable lastPulledAt: number = 0;

  async sync() {
    if (!this.session.userId) {
      return null;
    }

    await Promise.all([synchronize(this as any), loadSettings()]);

    this.lastPulledAt = await getLastPulledAt(database);
  }

  pullChanges = async ({ lastPulledAt }) => {
    const changes = await this.api.fetchChanges(lastPulledAt);

    return { changes, timestamp: Date.now() };
  };

  pushChanges = ({ lastPulledAt, changes }) => this.api.pushChanges(lastPulledAt, changes);
}
