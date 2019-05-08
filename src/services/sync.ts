import _ from 'lodash';
import { observable } from 'mobx';
import { synchronize } from '@nozbe/watermelondb/sync';
import { getLastPulledAt } from '@nozbe/watermelondb/sync/impl';
import { inject } from 'react-ioc';
import { Database } from '@nozbe/watermelondb';
import { Session } from './session';
import { FirebaseAPI } from './api';

export class SyncService {
  database = inject(this, Database);
  session = inject(this, Session);
  api = inject(this, FirebaseAPI);

  @observable lastPulledAt: number = 0;

  async sync() {
    if (!this.session.userId) {
      return null;
    }

    await synchronize({
      database: this.database,
      pullChanges: this.pullChanges,
      pushChanges: this.pushChanges,
    });

    this.lastPulledAt = await getLastPulledAt(this.database);
  }

  pullChanges = async ({ lastPulledAt }) => {
    const changes = await this.api.fetchChanges(lastPulledAt);

    const timestamp = Date.now();

    return { changes, timestamp };
  };

  pushChanges = ({ lastPulledAt, changes }) =>
    hasChanges(changes) ? this.api.pushChanges(lastPulledAt, changes) : Promise.resolve();
}

function hasChanges(changes) {
  return _.some(changes, table => _.some(table, _.size));
}
