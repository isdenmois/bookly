import { inject } from 'react-ioc'
import { computed } from 'mobx'
import { DataContext } from './data-context'

export class Books {
  dataContext = inject(this, DataContext)

  @computed get wantToRead() {
    return this.dataContext.books.filter(b => b.status === 'wish')
  }

  @computed get currentBooks() {
    return this.dataContext.books.filter(b => b.status === 'now')
  }

  @computed get haveRead() {
    return this.dataContext.books.filter(b => b.status === 'read')
  }
}
