import { action, observable } from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';

const SESSION_KEY = 'SESSION_KEY';
const INITIAL_BOOKS_COUNT = 80;

export class Session {
  @observable userId: string = null;
  @observable totalBooks: number = INITIAL_BOOKS_COUNT;
  @observable withFantlab: boolean = true;
  fantlabAuth: string = '';

  @action loadSession() {
    return AsyncStorage.getItem(SESSION_KEY)
      .then(session => JSON.parse(session) || {})
      .then(session => {
        this.userId = session.userId;
        this.totalBooks = session.totalBooks || INITIAL_BOOKS_COUNT;
        this.fantlabAuth = session.fantlabAuth || '';
        this.withFantlab = session.withFantlab;
      })
      .catch(error => console.warn(error));
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

  @action setSession(userId: string = null) {
    this.userId = userId;

    this.serializeSession();
  }

  @action stopSession() {
    this.userId = null;
    this.totalBooks = INITIAL_BOOKS_COUNT;
    this.fantlabAuth = '';
    this.withFantlab = true;

    return AsyncStorage.clear();
  }

  serializeSession() {
    const session = JSON.stringify({ userId: this.userId, totalBooks: this.totalBooks, fantlabAuth: this.fantlabAuth, withFantlab: this.withFantlab });

    AsyncStorage.setItem(SESSION_KEY, session);
  }
}
