import _ from 'lodash';

export const url = '/work/:bookId/extended';

export const collection = 'books';

export function mapParams({ bookId }) {
  return {
    query: { bookId },
  };
}

export const mapBody = {
  id: 'work_id',
  title: 'work_name',
  author: w => _.map(w.authors, a => a.name).join(', '),
  authors: w => _.map(w.authors, a => ({ id: a.id.toString(), name: a.name })),
  thumbnail: w => (w.image ? `https:${w.image}` : null),
  year: w => w.work_year_of_write || w.work_year,
  description: 'work_description',
  language: 'lang',
  languageId: 'lang_code',
  originalTitle: 'work_name_orig',
  type: 'work_type_name',
  editionCount,
  genre,
  searchTitles,
};

function editionCount(book) {
  const ru = _.find(_.get(book, 'editions_info.langs'), { lang_code: 'ru' });

  return ru ? ru.count : 0;
}

function genre(w) {
  const genre = _.find(_.get(w, 'classificatory.genre_group'), g => +g.genre_group_id === 1);

  return genre ? _.map(genre.genre, t => t.label).join(', ') : null;
}

function searchTitles(w) {
  return _.flatten([w.work_name, w.work_name_orig, w.work_name_alts])
    .filter(_.identity)
    .join(';');
}
