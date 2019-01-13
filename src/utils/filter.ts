import * as _ from 'lodash'

export function filterCollection(input, filters) {
  let result = input

  _.forEach(filters, (f, path) => {
    if (!f) return
    if (f.from || f.to) {
      result = filterRange(result, path, f)
      return
    }
    if (_.isArray(f)) {
      result = filterArray(result, path, f)
      return
    }

    result = filterValue(result, path, f)
  })

  return result
}

function filterRange(input, path, range) {
  return _.filter(input, item => {
    const value = _.get(item, path)

    return (range.from !== undefined ? value >= range.from : true) &&
          (range.to !== undefined ? value <= range.to : true)
  })
}

function filterArray(input, path, f) {
  return _.filter(input, item => _.some(_.get(item, path), f[0]))
}

function filterValue(input, path, f) {
  const value = {}

  _.set(value, path, f)

  return _.filter(input, value)
}
