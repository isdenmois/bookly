import { SYNC_URL } from 'services/config';
import { createApi } from '../base';

import fetchChangesSchema from './fetch-changes';
import pushChangesSchema from './push-changes';

export class FirebaseAPI {
  fetchChanges = createApi(SYNC_URL, fetchChangesSchema);
  pushChanges = createApi(SYNC_URL, pushChangesSchema);
}
