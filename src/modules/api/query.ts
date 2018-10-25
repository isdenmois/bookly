import * as nearley from 'nearley'
import * as grammar from './query-parser'

export function gql(literals) {
  const r = literals.join().trim().replace(/\s+/g, ' '),
        parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))

  parser.feed(r)

  return parser.results[0]
}

export function api(params) {
  console.log(params)

  return function (instance) {
    console.log(instance)
  }
}
