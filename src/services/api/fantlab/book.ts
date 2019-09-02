import _ from 'lodash';
import { API } from '../base/api';

const THUMBNAIL_ID = /(\d+$)/;

const response = {
  id: 'work_id',
  title: w => w.work_name || w.work_name_orig,
  author: w => _.map(w.authors, a => a.name).join(', '),
  authors: w => _.map(w.authors, a => ({ id: a.id.toString(), name: a.name })),
  // TODO: попробовать вытянуть без regexp
  thumbnail: w => (w.image ? _.get(w.image.match(THUMBNAIL_ID), '0', null) : null),
  year: w => w.work_year_of_write || w.work_year,
  description: 'work_description',
  language: w => _.capitalize(w.lang),
  languageId: 'lang_code',
  originalTitle: 'work_name_orig',
  type: 'work_type_name',
  otherTitles,
  editionCount,
  genre,
  search,
  parent,
  children,
  editionIds,
  translators,
  editionTranslators,
};

export type Params = { bookId: string };

export default (api: API<Params>) => api.get('/work/:bookId/extended').response(response);

function editionCount(book) {
  const ru = _.find(_.get(book, 'editions_info.langs'), { lang_code: 'ru' });

  return ru ? ru.count : 0;
}

function genre(w) {
  const g = _.find(_.get(w, 'classificatory.genre_group'), g => +g.genre_group_id === 1);

  return g ? _.map(g.genre, t => t.label).join(', ') : null;
}

function otherTitles(w) {
  return _.filter(w.work_name_alts, _.identity).join('; ');
}

function search(w) {
  return _.flatten([w.work_name, w.work_name_orig, otherTitles(w)])
    .filter(_.identity)
    .map(t => t.trim())
    .join(';')
    .toLowerCase();
}

function parent(w) {
  return _.flatMap(w.parents, type =>
    _.map(type, group => ({
      id: _.get(group, '[0].work_id'),
      title: _.get(group, '[0].work_name'),
      type: _.capitalize(_.get(group, '[0].work_type', '')) || 'Другое',
    })),
  ).filter(p => p.id);
}

function children(w) {
  return _.filter(w.children, c => +c.deep === 1 && c.work_id).map(c => ({
    id: c.work_id,
    title: c.work_name || c.work_name_alt || c.work_name_orig,
    type: _.capitalize(c.work_type) || 'Другое',
    year: c.work_year,
  }));
}

function getEditions(w) {
  const RUSSIAN_EDITION = 10;
  return _.get(w, `editions_blocks.${RUSSIAN_EDITION}.list`, []);
}

function editionIds(w) {
  return getEditions(w).map(el => el.edition_id);
}

function editionTranslators(w) {
  const translators = _.get(w, 'editions_info.translators', []);
  const translatorNames = {};

  getEditions(w)
    .filter(e => e.translators)
    .forEach(el => {
      translatorNames[el.edition_id] = el.translators
        .split(',')
        .map(id => _.get(translators.find(t => t.id === id), 'name', ''));
    });

  return translatorNames;
}

function translators(w) {
  let translations = _.find(w.translations, { lang_id: 1 });
  translations = _.get(translations, 'translations') || [];
  translations = translations.map(t => _.map(_.get(t, 'translators'), 'short_name').join(', ')).filter(t => t);

  return translations.sort();
}
