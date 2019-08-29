import _ from 'lodash';

export const url = '/search-ids';

export function mapParams({ e }) {
  return {
    query: { e },
  };
}

export const mapBody = {
  items: obj => editions(obj.editions),
};

function editions(e) {
  return _.map(e, el => ({ ...el, thumbnail: el.image ? `https:${el.image}` : null }));
}

export interface Edition {
  copies: number;
  id: number;
  image: string;
  isbns: string[];
  thumbnail: string;
  pages: number;
  published: number;
  url: string;
  year: number;
}

export type Request = (p: { e: string }) => Promise<Edition[]>;
