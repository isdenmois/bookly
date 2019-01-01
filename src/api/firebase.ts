import * as _ from 'lodash'

const BASE_URL = 'https://isden-book-manager.firebaseio.com'

export const firebase = {
  authorsGet: (user: string, sync: number) =>
    fetch(`${BASE_URL}/${user}/authors.json?orderBy="sync"&startAt=${sync}`).then(r => r.json()),

  booksGet: (user: string, sync: number) =>
    fetch(`${BASE_URL}/${user}/books.json?orderBy="sync"&startAt=${sync}`).then(r => r.json()).then(books => _.values(books)),

  challengesGet: (user: string) =>
    fetch(`${BASE_URL}/${user}/challenges.json`).then(r => r.json()),

  authorSave: (user: string, author: any) =>
    fetch(`${BASE_URL}/${user}/authors/${author.id}.json`, {method: 'PUT', body: JSON.stringify(author.name)}),

  bookSave: (user: string, book: any) =>
    fetch(`${BASE_URL}/${user}/books/${book.id}.json`, {method: 'PUT', body: JSON.stringify(book)}),
}
