import { api } from './api';
import { SyncService } from './sync';

export { database } from 'store';
export { settings } from './settings';
export { getNavigation, openModal } from './navigation';
export { api } from './api';
export { t } from './i18n';

export const syncService = new SyncService(api);
