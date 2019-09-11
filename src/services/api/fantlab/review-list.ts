import _ from 'lodash';
import { api } from '../base/api';

const response = {
  items: l =>
    _.map(l.items, r => ({
      id: `f_${r.response_id}`,
      body: r.response_text,
      likes: +r.response_votes || 0,
      date: `${r.response_date_iso}:00`,
      rating: r.mark,
      user: r.user_name,
      userAvatar: r.user_avatar ? `http:${r.user_avatar}` : null,
    })),
  total: 'total_count',
};

interface Params {
  bookId: string;
  sort: string;
}

export default api
  .get<Params>('/work/:bookId/responses', true)
  .query('sort')
  .response(response);

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
