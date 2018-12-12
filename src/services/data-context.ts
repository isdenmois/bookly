import { Instance } from 'mobx-state-tree'
import Models from 'models'

export class DataContext {
  static create() {
    const authors = [
      {id: '22', name: 'Стивен Кинг'},
    ]

    const books = [
      {id: '1', title: 'Бессоница', status: 'now', authors: ['22']},
    ]

    return Models.create({ authors, books })
  }
}

export interface DataContext extends Instance<typeof Models> {}
