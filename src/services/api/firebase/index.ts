import { FIREBASE_URL } from 'services/config';

import fetchChangesSchema from './fetch-changes';
import pushChangesSchema from './push-changes';
import removeDeletedSchema from './remove-deleted';

export class FirebaseAPI {
  fetchChanges = fetchChangesSchema.create(FIREBASE_URL);
  pushChanges = pushChangesSchema.create(FIREBASE_URL);
  removeDeleted = removeDeletedSchema.create(FIREBASE_URL);
}
