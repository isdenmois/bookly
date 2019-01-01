export class Storage {
  getItem(key: string): Promise<string | null> {
    return Promise.resolve(localStorage.getItem(key))
  }

  setItem(key: string, value: string) {
    return Promise.resolve(localStorage.setItem(key, value))
  }

  removeItem(key: string) {
    return Promise.resolve(localStorage.removeItem(key))
  }

  clear() {
    return Promise.resolve(localStorage.clear())
  }
}
