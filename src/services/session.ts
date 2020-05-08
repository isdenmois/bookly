import _ from 'lodash';
import { action, observable } from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';

export type Setting = typeof SETTINGS_FIELDS[number];

const SESSION_KEY = 'SESSION_KEY';
const INITIAL_BOOKS_COUNT = 80;
const INITIAL_SORT = { field: 'title', desc: false };
const INITIAL_YEAR = 2012;

const SETTINGS_FIELDS = <const>[
  'userId',
  'totalBooks',
  'withFantlab',
  'saveDateInChangeStatus',
  'lastAddress',
  'defaultSort',
  'fantlabAuth',
  'minYear',
  'audio',
  'withoutTranslation',
  'paper',
  'persistState',
];
const INITIAL_SETTINGS: any = {
  totalBooks: INITIAL_BOOKS_COUNT,
  fantlabAuth: '',
  defaultSort: INITIAL_SORT,
  lastAddress: '',
  minYear: INITIAL_YEAR,
};

export class Session {
  @observable userId: string = null;
  @observable totalBooks: number = INITIAL_BOOKS_COUNT;
  @observable withFantlab: boolean = false;
  @observable saveDateInChangeStatus: boolean = false;
  @observable lastAddress: string = '';
  @observable audio: boolean = false;
  @observable withoutTranslation: boolean = false;
  @observable paper: boolean = false;
  @observable persistState: boolean = false;
  @observable.ref defaultSort = INITIAL_SORT;
  fantlabAuth: string = '';
  minYear: number = INITIAL_YEAR;

  saving = false;
  needsToSave = false;

  loadSession() {
    return AsyncStorage.getItem(SESSION_KEY)
      .then(session => JSON.parse(session) || {})
      .then(session => this.setDefaults(session))
      .catch(error => console.warn(error.toString()));
  }

  @action set(setting: Setting, value: any) {
    if (this[setting] !== value) {
      this[setting as any] = value;
      this.saveSession(true);
    }
  }

  @action stopSession() {
    SETTINGS_FIELDS.forEach(field => {
      this[field as any] = INITIAL_SETTINGS[field] || null;
    });

    return AsyncStorage.clear();
  }

  @action setDefaults(data) {
    SETTINGS_FIELDS.forEach(field => {
      this[field as any] = data[field] ?? INITIAL_SETTINGS[field];
    });
  }

  serialize() {
    return _.pickBy(this, (value: any, key: any) => {
      if (!SETTINGS_FIELDS.includes(key)) return false;
      if (key in INITIAL_SETTINGS) return !_.isEqual(value, INITIAL_SETTINGS[key]);

      return Boolean(value);
    });
  }

  saveSession(needsToSave: boolean) {
    const session = this.serialize();

    AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));

    this.needsToSave = needsToSave;
  }
}

export const session: Session = new Session();
