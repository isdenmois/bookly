import { Instance } from 'mobx-state-tree'
import Models from 'models'

export class DataContext {
  static create() {
    const authors = [
      {id: '22', name: 'Стивен Кинг'},
      {id: '7612', name: 'Джон Ирвинг'},
      {id: '18953', name: 'Гиллиан Флинн'},
    ]

    // tslint:disable
    const books = [
      {id: '392', title: 'Бессоница', status: 'now', authors: ['22'], thumbnail: 'https://j.livelib.ru/boocover/1001484653/140/e1d6/Stiven_King__Bessonnitsa.jpg'},
      {id: '151712', title: 'Мир глазами Гарпа', status: 'wish', authors: ['7612'], thumbnail: 'https://j.livelib.ru/boocover/1000940775/140/b3e1/Dzhon_Irving__Mir_glazami_Garpa.jpg'},
      {id: '316', title: 'Пляска смерти', status: 'wish', authors: ['22'], thumbnail: 'https://j.livelib.ru/boocover/1002726440/140/756f/Stiven_King__Plyaska_smerti.jpg'},
      {id: '318', title: 'Куджо', status: 'read', authors: ['22'], thumbnail: 'https://j.livelib.ru/boocover/1002679006/200/0720/Stiven_King__Kudzho.jpg'},
      {id: '450277', title: 'Кто-то взрослый', status: 'read', authors: ['18953'], thumbnail: 'https://i.livelib.ru/boocover/1002780518/200/a4be/Gillian_Flinn__Ktoto_vzroslyj.jpg'},
    ]
    // tslint:enable

    return Models.create({ authors, books })
  }
}

export interface DataContext extends Instance<typeof Models> {}
