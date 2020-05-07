import _ from 'lodash';
import { api } from '../base/api';

interface Params {
  bookId: string;
}

export default api.get<Params>('/work/:bookId/extended', true).response(response);

export interface FantlabThumnail {
  id: number;
  url: string;
}

export const thumbnailCodes = ['ru', 'en'];

function response(work) {
  const paperBlocks = _.filter(work.editions_blocks, { block: 'paper' });
  let list = _.flatMap(paperBlocks, block => block?.list);

  if (!list.length) {
    list = _.head<any>(Object.values(work.editions_blocks))?.list;
  }

  list = list.filter(i => thumbnailCodes.includes(i.lang_code));

  if (!list.length) {
    return [];
  }

  return _.map(list, edition => ({
    id: edition.edition_id,
    url: edition.edition_id.toString(),
  }));
}
