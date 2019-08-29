import _ from 'lodash';

import { Params } from './book';

export { url, cache, mapParams } from './book';

export const mapBody = { items };

function items(work) {
  const paper = _.find(work.editions_blocks, { block: 'paper' }) || _.head(Object.values(work.editions_blocks));

  if (!paper) {
    return [];
  }

  return _.map(paper.list, edition => ({
    id: edition.edition_id,
    url: edition.edition_id.toString(),
  }));
}

export type Request = (p: Params) => Promise<FantlabThumnail>;

export interface FantlabThumnail {
  id: number;
  url: string;
}
