import { pick } from 'lodash';
import { action, observable } from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';

export type Setting = typeof SETTINGS_FIELDS[number];

const SESSION_KEY = 'SESSION_KEY';
const INITIAL_BOOKS_COUNT = 80;
const INITIAL_SORT = { field: 'title', desc: false };

const SETTINGS_FIELDS = <const>[
  'userId',
  'totalBooks',
  'withFantlab',
  'saveDateInChangeStatus',
  'lastAddress',
  'defaultSort',
  'fantlabAuth',
  'stat',
];
const INITIAL_SETTINGS: any = {
  totalBooks: INITIAL_BOOKS_COUNT,
  fantlabAuth: '',
  defaultSort: INITIAL_SORT,
  lastAddress: '',
};

export class Session {
  @observable userId: string = null;
  @observable totalBooks: number = INITIAL_BOOKS_COUNT;
  @observable withFantlab: boolean = true;
  @observable saveDateInChangeStatus: boolean = false;
  @observable lastAddress: string = '';
  @observable stat: boolean = false;
  @observable.ref defaultSort = INITIAL_SORT;
  fantlabAuth: string = '';

  @action loadSession() {
    return AsyncStorage.getItem(SESSION_KEY)
      .then(session => JSON.parse(session) || {})
      .then(session => {
        SETTINGS_FIELDS.forEach(field => {
          this[field as any] = session[field] || INITIAL_SETTINGS[field];
        });
      })
      .catch(error => console.warn(error.toString()));
  }

  @action set(setting: Setting, value: any) {
    if (this[setting] !== value) {
      this[setting as any] = value;
      this.serializeSession();
    }
  }

  @action stopSession() {
    SETTINGS_FIELDS.forEach(field => {
      this[field as any] = INITIAL_SETTINGS[field] || null;
    });

    return AsyncStorage.clear();
  }

  serializeSession() {
    const session = JSON.stringify(pick(this, SETTINGS_FIELDS));

    AsyncStorage.setItem(SESSION_KEY, session);
  }
}
