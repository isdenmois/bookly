import { Storage, Session, SyncService } from 'services';
import { FirebaseAPI, FantlabAPI } from 'api';

export const providers = [Storage, Session, SyncService, FirebaseAPI, FantlabAPI];
