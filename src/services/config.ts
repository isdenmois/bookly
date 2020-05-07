import {
  FANTLAB_URL as fl,
  FIREBASE_URL as fb,
  FANTLAB_ROOT_URL as rfl,
  LIVELIB_URL as ll,
  FIREBASE_DATABASE_URL as fbdb,
} from 'react-native-dotenv';
import { Platform } from 'react-native';

export const FANTLAB_URL = fl;
export const FIREBASE_URL = fb;
export const FANTLAB_ROOT_URL = rfl;
export const LIVELIB_URL = Platform.OS === 'web' ? '/api/livelib' : ll;
export const FIREBASE_DATABASE_URL = fbdb;
