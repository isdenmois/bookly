import { LIVELIB_APIKEY } from 'react-native-dotenv';
import _ from 'lodash';
import { api } from '../base/api';
import { RemoteReview } from '../fantlab/review-list';

type Params = { bookId: string };

const fields = 'count_pluses,creation_datetime,id,rating,text,user(pic_100,login)';

function response(r): RemoteReview[] {
  return _.map(r.data, i => ({
    id: `l_${i.id}`,
    body: i.text,
    likes: i.count_pluses,
    date: i.creation_datetime,
    rating: i.rating,
    user: _.get(i, 'user.login'),
    userAvatar: _.get(i, 'user.pic_100'),
  }));
}

export default api
  .get<Params>('/books/:bookId/reviews', true)
  .query(({ bookId }: Params) => ({
    bookId: bookId.replace('l_', ''),
    start: 1,
    count: 24,
    andyll: LIVELIB_APIKEY,
    fields,
  }))
  .response(response);
