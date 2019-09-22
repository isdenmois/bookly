import { action, observable } from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';

const SESSION_KEY = 'SESSION_KEY';
const INITIAL_BOOKS_COUNT = 80;

const INITIAL_SORT = { field: 'title', desc: false };

export class Session {
  @observable userId: string = null;
  @observable totalBooks: number = INITIAL_BOOKS_COUNT;
  @observable withFantlab: boolean = true;
  @observable saveDateInChangeStatus: boolean = false;
  @observable lastAddress: string = '';
  @observable.ref defaultSort = INITIAL_SORT;
  fantlabAuth: string = '';

  @action loadSession() {
    return AsyncStorage.getItem(SESSION_KEY)
      .then(session => JSON.parse(session) || {})
      .then(session => {
        this.userId = session.userId;
        this.totalBooks = session.totalBooks || INITIAL_BOOKS_COUNT;
        this.fantlabAuth = session.fantlabAuth || '';
        this.withFantlab = session.withFantlab;
        this.saveDateInChangeStatus = session.saveDateInChangeStatus;
        this.defaultSort = session.defaultSort || INITIAL_SORT;
        this.lastAddress = session.lastAddress || '';
      })
      .catch(error => console.warn(error.toString()));
  }

  setAuth(fantlabAuth: string) {
    if (this.fantlabAuth !== fantlabAuth) {
      this.fantlabAuth = fantlabAuth;
      this.serializeSession();
    }
  }

  @action setWithFantlab(withFantlab: boolean) {
    if (this.withFantlab !== withFantlab) {
      this.withFantlab = withFantlab;
      this.serializeSession();
    }
  }

  @action setTotalBooks(totalBooks: number) {
    if (this.totalBooks !== totalBooks) {
      this.totalBooks = totalBooks;

      this.serializeSession();
    }
  }

  @action setDefaultSort(sort) {
    if (this.defaultSort !== sort) {
      this.defaultSort = sort;

      this.serializeSession();
    }
  }

  @action setSaveDateInChangeStatus(saveDateInChangeStatus) {
    if (this.saveDateInChangeStatus !== saveDateInChangeStatus) {
      this.saveDateInChangeStatus = saveDateInChangeStatus;

      this.serializeSession();
    }
  }

  @action setLastAddress(address: string) {
    if (this.lastAddress !== address) {
      this.lastAddress = address;

      this.serializeSession();
    }
  }

  @action setSession(userId: string = null) {
    this.userId = userId;

    this.serializeSession();
  }

  @action stopSession() {
    this.userId = null;
    this.totalBooks = INITIAL_BOOKS_COUNT;
    this.fantlabAuth = '';
    this.withFantlab = true;
    this.saveDateInChangeStatus = false;
    this.defaultSort = INITIAL_SORT;
    this.lastAddress = '';

    return AsyncStorage.clear();
  }

  serializeSession() {
    const session = JSON.stringify({
      userId: this.userId,
      totalBooks: this.totalBooks,
      fantlabAuth: this.fantlabAuth,
      withFantlab: this.withFantlab,
      saveDateInChangeStatus: this.saveDateInChangeStatus,
      defaultSort: this.defaultSort,
      lastAddress: this.lastAddress,
    });

    AsyncStorage.setItem(SESSION_KEY, session);
  }
}
