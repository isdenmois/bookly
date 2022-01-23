import _ from 'lodash';
import { t } from 'services/i18n';
import { api } from '../base/api';
import { thumbnailCodes } from './thumbnails';

const THUMBNAIL_ID = /(\d+)($|\?)/;

const response = {
  id: 'work_id',
  title: w => w.work_name || w.work_name_orig,
  author,
  authors: w => _.map(w.authors, a => ({ id: a.id.toString(), name: a.name })),
  // TODO: попробовать вытянуть без regexp
  thumbnail: w => w.image?.match(THUMBNAIL_ID)?.[1] || w.image || null,
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
  films,
  classification,
  avgRating,
  voters: 'val_voters',
};

export type Params = { bookId: string };

export default api.get<Params>('/work/:bookId/extended').response(response);

function author(w) {
  return _.map(w.authors, a => a.name).join(', ');
}

function editionCount(work) {
  const paperBlocks = _.filter(work.editions_blocks, { block: 'paper' });
  const list = _.flatMap(paperBlocks, block => block?.list);

  return list.filter(i => thumbnailCodes.includes(i.lang_code)).length;
}

function genre(w) {
  const g = _.find(w.classificatory?.genre_group, g => +g.genre_group_id === 1);

  return g ? _.map(g.genre, t => t.label).join(', ') : null;
}

function otherTitles(w) {
  const titles = [w.work_name].concat(w.work_name_alts);

  return _.filter(titles, _.identity).join('; ');
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
      id: String(group?.[0]?.work_id),
      title: group?.[0]?.work_name,
      type: _.capitalize(group?.[0]?.work_type || '') || 'Другое',
    })),
  ).filter(p => p.id);
}

function children(w) {
  const parentAuthor = author(w);
  const result = [];
  const parents = [];
  let prev = null;
  let deep = 1;

  _.forEach(w.children, c => {
    const childAuthor = c.authors && author(c);
    const item = {
      id: c.work_id ? String(c.work_id) : null,
      title: c.work_name || c.work_name_alt || c.work_name_orig,
      type: _.capitalize(c.work_type) || 'Другое',
      year: c.work_year,
      author: childAuthor && parentAuthor !== childAuthor ? childAuthor : null,
    };

    if (!c.deep || c.deep <= 1) {
      result.push(item);
    } else if (c.deep > deep) {
      parents.unshift(prev);
      prev.children = [item];
    } else if (c.deep < deep) {
      parents.shift();
      parents[0].children.push(item);
    } else if (parents.length) {
      parents[0].children.push(item);
    } else {
      result.push(item);
    }

    deep = c.deep || 1;
    prev = item;
  });

  return result;
}

const RUSSIAN_EDITIONS = 10;
const OTHER_EDITIONS = 80;

function getEditions(w, langId = RUSSIAN_EDITIONS) {
  return w.editions_blocks?.[langId]?.list || [];
}

function editionIds(w) {
  return [...getEditions(w, RUSSIAN_EDITIONS), ...getEditions(w, OTHER_EDITIONS)].map(el => el.edition_id);
}

function editionTranslators(w) {
  const translators = w.editions_info?.translators || [];
  const translatorNames = {};

  getEditions(w)
    .filter(e => e.translators)
    .forEach(el => {
      translatorNames[el.edition_id] = el.translators
        .split(',')
        .map(id => translators.find(t => t.id === id)?.name || '');
    });

  return translatorNames;
}

function translators(w) {
  let translations = _.find(w.translations, { lang_id: 1 });
  translations = translations?.translations || [];
  translations = translations.map(getTranslation).filter(t => t);

  return translations.sort();
}

function getTranslation(item) {
  if (!item) return;
  const name = _.map(item.translators, 'short_name').join(', ');

  if (item.source_lang) {
    return t('common.translated', { name: name, lang: item.source_lang });
  }

  return name;
}

function films(w) {
  if (!w.films) return null;

  const films = _.flatten(Object.values(w.films)).map((f: any) => ({
    id: String(f.film_id),
    title: f.rusname || f.name,
    country: f.country,
    year: f.year,
  }));

  return _.orderBy(films, 'year', 'desc');
}

function classification(w) {
  if (!w.classificatory?.total_count) return null;

  return _.map(w.classificatory.genre_group, g => {
    const title = +g.genre_group_id === 1 ? 'Жанр' : g.label;
    let genres;

    if (+g.genre_group_id === 3) {
      genres = _.flatMap(g.genre, genre => getPlaceGroupValues(genre));
    } else {
      genres = _.flatMap(g.genre, genre => getGroupValues(genre));
    }

    return { id: +g.genre_group_id, title, genres };
  });
}

function getGroupValues(g, parentIds = []) {
  if (!g) return [];
  const id = +g.genre_id;
  const ids = parentIds.concat(id);

  const c = _.flatMap(g.genre, genre => getGroupValues(genre, ids));
  const title = g.percent && g.percent < 1 ? `${g.label} (${g.percent * 100}%)` : g.label;

  return [{ id, ids, title }].concat(c);
}

function getPlaceGroupValues(g, parentIds = [], parent = null) {
  if (!g) return [];
  const id = +g.genre_id;
  const ids = parentIds.concat(id);
  let title = parentIds.length > 1 ? [parent, g.label].join(', ') : g.label;

  const c = _.flatMap(g.genre, genre => getPlaceGroupValues(genre, ids, title));

  if (g.percent && g.percent < 1) {
    title = `${title} (${g.percent * 100}%)`;
  }

  return [{ id, ids, title }].concat(c);
}

function avgRating(work) {
  let rating = work.val_midmark_by_weight || work.val_midmark;

  if (!rating) return null;

  rating = Math.round(rating * 10) / 10;

  return `${rating} / 10`;
}
