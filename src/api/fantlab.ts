import * as _ from 'lodash'

const BASE_URL = 'https://api.fantlab.ru'

export interface FantlabWork {
  work_id: number
  name: string
  rusname: string
  name_eng: string
  altname: string
  autor_rusname: string
  autor_id: number
  year: number
  thumbnail: string
}

export function searchBooks(query): Promise<FantlabWork[]> {
  const q = encodeURIComponent(query.replace(/s+/g, '+'))

  return fetch(`https://api.fantlab.ru/search-works?q=${q}&page=1&onlymatches=1`)
    .then(r => r.json())
    .then(data => _.map(data, w => ({
      ...w,
      thumbnail: w.pic_edition_id_auto ? `https://data.fantlab.ru/images/editions/big/${w.pic_edition_id_auto}` : '',
    })) as any)
}
