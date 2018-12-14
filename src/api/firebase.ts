import * as _ from 'lodash'

const BASE_URL = 'https://isden-book-manager.firebaseio.com'

function userParse(user) {
  const authors: any = {}

  _.forEach(user.authors, (name, id) => {
    authors[id] = {id: +id, name, saved: true}
  })

  return {
    authors,
    books: _.values(user.books),
    challenges: user.challenges,
  }
}

export const firebase = {
  userGet: (user: string) =>
    fetch(`${BASE_URL}/${user}.json`).then(r => r.json()).then(userParse),
  authorSave: (user: string, author: any) =>
    fetch(`${BASE_URL}/${user}/authors/${author.id}.json`, {method: 'PUT', body: JSON.stringify(author.name)}),
  bookSave: (user: string, book: any) =>
    fetch(`${BASE_URL}/${user}/books/${book.id}.json`, {method: 'PUT', body: JSON.stringify(book)}),
}
