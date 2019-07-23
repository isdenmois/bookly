import { SYNC_URL } from 'services/config';
import { createApi } from '../base';

import * as fetchChangesSchema from './fetch-changes';
import * as pushChangesSchema from './push-changes';

export class FirebaseAPI {
  baseUrl = SYNC_URL;

  fetchChanges = createApi(this, fetchChangesSchema);
  pushChanges = createApi(this, pushChangesSchema);
}
