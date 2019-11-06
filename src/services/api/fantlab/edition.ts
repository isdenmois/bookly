import _ from 'lodash';
import { api } from '../base/api';

// TODO: тайпинги
type Query = (id: string | number) => Promise<any>;
export default api.get<Query>('/edition/:id/extended').query(id => ({ id }));
