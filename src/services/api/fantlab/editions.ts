import _ from 'lodash';

export const url = '/search-ids';

export const cache = true;

export function mapParams({ e }) {
  return {
    query: { e },
  };
}

export const mapBody = {
  items: obj => editions(obj.editions),
}

function editions(e) {
  return _.map(e, (el) => ({ ...el, thumbnail: el.image ? `https:${el.image}` : null, }))
}
