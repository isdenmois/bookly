import { database } from 'store';
import List from 'store/list';

export const allListsQuery = () => database.collections.get<List>('lists').query();
