import _ from 'lodash';
import { api } from '../base/api';

type Query = (q: string) => Promise<any[]>;
export default api.get<Query>('/search-editions').query(q => ({ q, page: 1, onlymatches: 1 }));
