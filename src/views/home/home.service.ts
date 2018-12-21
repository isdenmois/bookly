import { inject } from 'react-ioc'
import { computed } from 'mobx'

import { Books, DataContext } from 'services'

export class HomeService {
  dataContext = inject(this, DataContext)
  books = inject(this, Books)

  currentYear: number = currentYear()
  currentYearDate = new Date(this.currentYear, 0, 1)

  @computed get booksReadCount() {
    return this.books.haveRead.filter(b => b.date >= this.currentYearDate).length
  }

  @computed get booksReadChallenge() {
    const challenge = this.dataContext.challenges.get(this.currentYear.toString())

    return challenge ? challenge.booksCount : 0
  }

  @computed get booksReadForecast() {
    const yearProgress = dayOfYear() / 365,
          needToRead = Math.round(yearProgress * this.booksReadChallenge)

    return this.booksReadCount - needToRead
  }
}

const ONE_DAY = 1000 * 60 * 60 * 24

function dayOfYear() {
  const now = new Date(),
        start = new Date(now.getFullYear(), 0, 0),
        diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000)

  return Math.floor(diff / ONE_DAY)
}

function currentYear() {
  return new Date().getFullYear()
}
