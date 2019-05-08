import { SYNC_URL } from 'react-native-dotenv';
import { inject } from 'react-ioc';
import { createApi } from '../base';
import { Session } from 'services/session';

import * as fetchChangesSchema from './fetch-changes';
import * as pushChangesSchema from './push-changes';

export class FirebaseAPI {
  session = inject(this, Session);

  fetchChanges = createApi(this, SYNC_URL, fetchChangesSchema);
  pushChanges = createApi(this, SYNC_URL, pushChangesSchema);
}
