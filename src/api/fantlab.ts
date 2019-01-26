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

  return fetch(`${BASE_URL}/search-works?q=${q}&page=1&onlymatches=1`)
    .then(r => r.json())
    .then(data => _.map(data, w => ({
      ...w,
      thumbnail: w.pic_edition_id_auto ? `https://data.fantlab.ru/images/editions/big/${w.pic_edition_id_auto}` : '',
    })) as any)
}

export interface FantlabExtendedWork {
  work_id: string
  work_name: string
  image: string
  authors: FantlabAuthor[]
  classificatory: FantlabClassificatory
  work_year: string
}

export interface FantlabAuthor {
  id: string
  name: string
}

export interface FantlabClassificatory {
  genre_group: FantlabGenreGroup[]
}

export interface FantlabGenreGroup {
  genre: FantlabGenre[]
  label: string
  genre_group_id: string
}

export interface FantlabGenre {
  genre_id: number
  label: string
}

export function getWorkDetails(workId): Promise<FantlabExtendedWork> {
  return fetch(`${BASE_URL}/work/${workId}/extended`)
    .then(r => r.json())
}
