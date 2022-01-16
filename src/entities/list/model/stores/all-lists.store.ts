import { fromRx } from 'shared/lib';
import { allListsQuery } from '../queries';

export const $allLists = fromRx(() => allListsQuery().observeWithColumns(['name']), []);
