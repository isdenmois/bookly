import { database } from 'store';
import { session } from './session';
import { api } from './api';
import { SyncService } from './sync';

export { database } from 'store';
export { session } from './session';
export { navigation } from './navigation';
export { api } from './api';

export const syncService = new SyncService(database, session, api);
