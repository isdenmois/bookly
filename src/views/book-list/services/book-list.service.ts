import * as _ from 'lodash';
import { computed } from 'mobx'
import { inject } from 'react-ioc'

import { DataContext } from 'services'
import { BOOK_READ_STATUS } from 'models/book';

export enum BookListFilters {
  authorId
}

export class BookListService {
  data = inject(this, DataContext)

  constructor(private status: BOOK_READ_STATUS) {
  }

  @computed get books() {
    const filters = {
      status: this.status
    }

    return _.filter(this.data.books, filters)
  }
}
