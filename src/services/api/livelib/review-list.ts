import { LIVELIB_APIKEY } from 'react-native-dotenv';
import _ from 'lodash';
import { api } from '../base/api';
import { ReviewList } from '../fantlab/review-list';

type Params = { bookId: string; page?: number };

const fields = 'count_pluses,creation_datetime,id,rating,text,user(pic_100,login)';

function response(r): ReviewList {
  const items = _.map(r.data, i => ({
    id: `l_${i.id}`,
    body: i.text,
    likes: i.count_pluses,
    date: i.creation_datetime,
    rating: i.rating,
    user: _.get(i, 'user.login'),
    userAvatar: _.get(i, 'user.pic_100'),
  }));

  return { items, total: r.count || 0 };
}

export default api
  .get<Params>('/books/:bookId/reviews', true)
  .query(({ bookId, page }: Params) => {
    console.log(bookId, page);

    return {
      bookId: bookId.replace('l_', ''),
      start: page,
      count: 24,
      andyll: LIVELIB_APIKEY,
      fields,
    };
  })
  .response(response);
