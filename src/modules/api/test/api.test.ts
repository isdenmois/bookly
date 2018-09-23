import { api } from '../api'

describe('Api', function () {
  it('should call books', function () {
    api.book.get({}, {})
  })
})
