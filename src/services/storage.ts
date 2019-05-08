export class Storage {
  getItem(key: string) {
    return Promise.resolve(localStorage.getItem(key));
  }

  setItem(key: string, value: any) {
    return Promise.resolve(localStorage.setItem(key, value));
  }

  removeItem(key: string) {
    return Promise.resolve(localStorage.removeItem(key));
  }

  clear() {
    return Promise.resolve(localStorage.clear());
  }
}
