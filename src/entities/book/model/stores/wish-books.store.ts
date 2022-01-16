import { fromRx } from 'shared/lib';
import { wishBooksQuery } from '../queries';

export const $wishBooksCount = fromRx(() => wishBooksQuery().observeCount(), 1);
