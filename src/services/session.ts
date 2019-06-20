import { action, observable } from 'mobx';
import { inject } from 'react-ioc';

import { Storage } from './storage';

const SESSION_KEY = 'SESSION_KEY';
const INITIAL_BOOKS_COUNT = 80;

export class Session {
  @observable userId: string = null;
  @observable totalBooks: number = INITIAL_BOOKS_COUNT;

  storage = inject(this, Storage);

  @action loadSession() {
    return this.storage
      .getItem(SESSION_KEY)
      .then(session => JSON.parse(session))
      .then(session => {
        this.userId = session.userId;
        this.totalBooks = session.totalBooks || INITIAL_BOOKS_COUNT;
      })
      .catch(error => console.warn(error));
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

    return this.storage.clear();
  }

  serializeSession() {
    const session = JSON.stringify({ userId: this.userId, totalBooks: this.totalBooks });

    this.storage.setItem(SESSION_KEY, session);
  }
}
