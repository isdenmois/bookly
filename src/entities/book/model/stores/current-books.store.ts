import { fromRx } from 'shared/lib';
import { currentBooksQuery } from '../queries';

export const $currentBooks = fromRx(() => currentBooksQuery().observeWithColumns(['thumbnail']), []);
