import _ from 'lodash';

const THUMBNAIL_URL = 'https://data.fantlab.ru/images/editions/big';

export { url, cache, mapParams } from './book';

export const mapBody = { thumbnails };

function thumbnails(work) {
  const paper = _.find(work.editions_blocks, { block: 'paper' }) || _.head(Object.values(work.editions_blocks));

  if (!paper) {
    return [];
  }

  return _.map(paper.list, edition => ({
    id: edition.edition_id,
    url: `${THUMBNAIL_URL}/${edition.edition_id}`,
  }));
}
