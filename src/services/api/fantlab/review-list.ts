import _ from 'lodash';

export const url = '/work/:bookId/responses';

export const cache = true;

export function mapParams({ bookId, page, sort }) {
  return {
    query: { bookId, page, sort },
  };
}

export const mapBody = {
  items: l =>
    _.map(l.items, r => ({
      id: `f_${r.response_id}`,
      body: r.response_text,
      likes: +r.response_votes || 0,
      date: r.response_date_iso,
      rating: r.mark,
      user: r.user_name,
      userAvatar: r.user_avatar ? `http:${r.user_avatar}` : null,
    })),
  total: 'total_count',
};

export type Request = (p: Params) => Promise<FantlabReview[]>;

export interface ReviewList {
  items: FantlabReview[];
  total: number;
}

export interface FantlabReview {
  id: string;
  body: string;
  likes: number;
  date: string;
  rating: number;
  user: string;
  userAvatar: string;
}

interface Params {
  bookId: string;
  sort: string;
}
