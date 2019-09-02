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

function response(work) {
  const paper = _.find(work.editions_blocks, { block: 'paper' }) || _.head(Object.values(work.editions_blocks));

  if (!paper) {
    return [];
  }

  return _.map(paper.list, edition => ({
    id: edition.edition_id,
    url: edition.edition_id.toString(),
  }));
}
