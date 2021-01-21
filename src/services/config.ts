import {
  FANTLAB_URL as fl,
  FIREBASE_URL as fb,
  FANTLAB_ROOT_URL as rfl,
  LIVELIB_URL as ll,
  FIREBASE_DATABASE_URL as fbdb,
  LIVELIB_APIKEY as llap,
  BOOK_UPLOADER_URL as buu,
} from '@env';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

export const FANTLAB_URL = fl;
export const FIREBASE_URL = isWeb ? '/api' : fb;
export const FANTLAB_ROOT_URL = rfl;
export const LIVELIB_URL = isWeb ? '/api/livelib' : ll;
export const FIREBASE_DATABASE_URL = fbdb;
export const LIVELIB_APIKEY = llap;
export const IS_E2E = false;
export const BOOK_UPLOADER_URL = buu;
