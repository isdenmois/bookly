import * as _ from 'lodash'

function mapResponseArray(r) {
  return r.json().then(data => _.map(data, (value, id) => _.assign({id}, value)))
}

export const firebase = {
  books: () => fetch('https://isden-book-manager.firebaseio.com/books.json').then(mapResponseArray),
}
