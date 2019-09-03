import { SYNC_URL } from 'services/config';

import fetchChangesSchema from './fetch-changes';
import pushChangesSchema from './push-changes';

export class FirebaseAPI {
  fetchChanges = fetchChangesSchema.create(SYNC_URL);
  pushChanges = pushChangesSchema.create(SYNC_URL);
}
