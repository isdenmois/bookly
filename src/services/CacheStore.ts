import { action, observable } from 'mobx'

export class CacheStore {
  data = observable.map({})

  @action setValue(key, value) {
    this.data.set(key, value)
  }

  getValues(keys: string[]) {
    const data = {}

    keys.forEach(key => data[key] = this.data.get(key))

    return data
  }
}
