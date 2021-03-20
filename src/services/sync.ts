import { synchronize } from '@nozbe/watermelondb/sync';
import { getLastPulledAt } from '@nozbe/watermelondb/sync/impl';
import { database } from 'store';
import { settings } from './settings';
import { API } from './api';
import { loadSettings } from './settings-sync';

export class SyncService {
  database = database;
  api: API;

  constructor(api: API) {
    this.api = api;
  }

  lastPulledAt: number = 0;

  async sync() {
    if (!settings.userId) {
      return null;
    }

    await synchronize(this as any);
    await loadSettings();

    this.lastPulledAt = await getLastPulledAt(database);
  }

  pullChanges = async ({ lastPulledAt }) => {
    const changes = await this.api.fetchChanges(lastPulledAt);

    return { changes, timestamp: Date.now() };
  };

  pushChanges = ({ lastPulledAt, changes }) => this.api.pushChanges(lastPulledAt, changes);
}
